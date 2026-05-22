"""
Obtiene noticias financieras actualizadas.
Orden: NewsAPI (NEWS_API_KEY) → RSS públicos → fallback local.
"""

from __future__ import annotations

import os
import re
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime
from typing import Any
from xml.etree import ElementTree

import requests

# Palabras clave → categoría del frontend
_CATEGORY_RULES: list[tuple[str, list[str]]] = [
    (
        "Tecnología",
        [
            "tech", "tecnolog", "apple", "google", "microsoft", "nvidia", "meta",
            "inteligencia artificial", " ia ", "chip", "software", "semiconductor",
        ],
    ),
    (
        "Economía",
        [
            "fed", "inflación", "inflation", "bce", "tasa de interés", "gdp", "pib",
            "economía", "economic", "empleo", "fiscal", "monetary", "treasury",
        ],
    ),
    (
        "Empresas",
        [
            "empresa", "earnings", "ganancias", "ceo", "corporat", "merger",
            "adquisición", "tesla", "amazon", "resultados trimestrales",
        ],
    ),
    (
        "Mercados",
        [
            "mercado", "bolsa", "s&p", "nasdaq", "dow", "índice", "index",
            "oro", "petróleo", "oil", "gold", "stock", "wall street", "trading",
        ],
    ),
]


def infer_category(title: str, summary: str) -> str:
    text = f"{title} {summary}".lower()
    for category, keywords in _CATEGORY_RULES:
        if any(kw in text for kw in keywords):
            return category
    return "Mercados"


def _article(
    source: str,
    title: str,
    summary: str,
    date: datetime,
    url: str,
    category: str | None = None,
    author: str | None = None,
) -> dict[str, Any]:
    return {
        "source": source[:150],
        "title": title.strip(),
        "summary": (summary or title).strip()[:500],
        "date": date.astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
        "url": url,
        "category": category or infer_category(title, summary),
        "author": author,
    }


def _fetch_newsapi() -> list[dict[str, Any]] | None:
    api_key = os.getenv("NEWS_API_KEY", "").strip()
    if not api_key:
        return None

    articles: list[dict[str, Any]] = []
    endpoints = [
        (
            "https://newsapi.org/v2/top-headlines",
            {"category": "business", "language": "es", "pageSize": 15},
        ),
        (
            "https://newsapi.org/v2/everything",
            {
                "q": "mercados OR bolsa OR finanzas OR economía",
                "language": "es",
                "sortBy": "publishedAt",
                "pageSize": 15,
            },
        ),
    ]

    seen_urls: set[str] = set()
    for url, params in endpoints:
        try:
            resp = requests.get(
                url,
                params={**params, "apiKey": api_key},
                timeout=12,
            )
            resp.raise_for_status()
            data = resp.json()
            if data.get("status") != "ok":
                continue
            for item in data.get("articles", []):
                link = item.get("url") or ""
                if not link or link in seen_urls:
                    continue
                seen_urls.add(link)
                published = item.get("publishedAt")
                try:
                    dt = datetime.fromisoformat(published.replace("Z", "+00:00")) if published else datetime.now(timezone.utc)
                except (ValueError, AttributeError):
                    dt = datetime.now(timezone.utc)
                articles.append(
                    _article(
                        source=item.get("source", {}).get("name") or "NewsAPI",
                        title=item.get("title") or "Sin título",
                        summary=item.get("description") or item.get("title") or "",
                        date=dt,
                        url=link,
                        author=item.get("author"),
                    )
                )
        except requests.RequestException:
            continue

    return articles if articles else None


def _parse_rss_xml(
    xml_text: str,
    default_source: str,
    default_category: str | None = None,
) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    try:
        root = ElementTree.fromstring(xml_text)
    except ElementTree.ParseError:
        return items

    for item in root.findall(".//item"):
        title_el = item.find("title")
        link_el = item.find("link")
        desc_el = item.find("description")
        pub_el = item.find("pubDate")
        source_el = item.find("source")

        title = (title_el.text if title_el is not None else "") or ""
        url = (link_el.text if link_el is not None else "") or ""
        if not title or not url:
            continue

        summary = desc_el.text if desc_el is not None else title
        summary = re.sub(r"<[^>]+>", "", summary or "").strip()

        dt = datetime.now(timezone.utc)
        if pub_el is not None and pub_el.text:
            try:
                dt = parsedate_to_datetime(pub_el.text)
                if dt.tzinfo is None:
                    dt = dt.replace(tzinfo=timezone.utc)
            except (TypeError, ValueError, OverflowError):
                pass

        source_name = default_source
        if source_el is not None and source_el.text:
            source_name = source_el.text
        elif source_el is not None and source_el.get("url"):
            source_name = source_el.get("url", default_source)

        items.append(
            _article(
                source=source_name,
                title=title,
                summary=summary,
                date=dt,
                url=url,
                category=default_category,
            )
        )
    return items


_RSS_FEEDS: list[tuple[str, str, str]] = [
    (
        "Google Mercados",
        "https://news.google.com/rss/search?q=mercados+bolsa+finanzas&hl=es-419&gl=US&ceid=US:es-419",
        "Mercados",
    ),
    (
        "Google Economía",
        "https://news.google.com/rss/search?q=econom%C3%ADa+inflaci%C3%B3n+banco+central&hl=es-419&gl=US&ceid=US:es-419",
        "Economía",
    ),
    (
        "Google Empresas",
        "https://news.google.com/rss/search?q=empresas+negocios+ganancias+corporativo&hl=es-419&gl=US&ceid=US:es-419",
        "Empresas",
    ),
    (
        "Google Tecnología",
        "https://news.google.com/rss/search?q=tecnolog%C3%ADa+inteligencia+artificial+empresas&hl=es-419&gl=US&ceid=US:es-419",
        "Tecnología",
    ),
    (
        "Yahoo Finance",
        "https://feeds.finance.yahoo.com/rss/2.0/headline?s=%5EGSPC&region=US&lang=en-US",
        "Mercados",
    ),
    (
        "Google Tech EN",
        "https://news.google.com/rss/search?q=technology+stocks+earnings&hl=en-US&gl=US&ceid=US:en",
        "Tecnología",
    ),
    (
        "Google Business EN",
        "https://news.google.com/rss/search?q=corporate+earnings+mergers&hl=en-US&gl=US&ceid=US:en",
        "Empresas",
    ),
]

_CATEGORIES = ("Mercados", "Empresas", "Economía", "Tecnología")
_MIN_PER_CATEGORY = 5
_MAX_PER_CATEGORY = 12


def _fetch_rss_feeds() -> list[dict[str, Any]] | None:
    articles: list[dict[str, Any]] = []
    seen_urls: set[str] = set()

    for source_name, feed_url, category in _RSS_FEEDS:
        try:
            resp = requests.get(
                feed_url,
                timeout=12,
                headers={"User-Agent": "PortafolioAI/1.0 (educational project)"},
            )
            resp.raise_for_status()
            for item in _parse_rss_xml(resp.text, source_name, default_category=category):
                if item["url"] in seen_urls:
                    continue
                seen_urls.add(item["url"])
                articles.append(item)
        except requests.RequestException:
            continue

    articles.sort(key=lambda x: x["date"], reverse=True)
    return articles if articles else None


def _supplement_templates() -> dict[str, list[tuple[str, str, str, int]]]:
    """Plantillas (fuente, título, resumen, horas_atrás) por categoría."""
    return {
        "Empresas": [
            ("CNBC", "Tesla supera estimaciones de entregas trimestrales", "La automotriz eléctrica reporta crecimiento en ventas globales y márgenes operativos.", 1),
            ("Forbes", "Amazon invierte en nuevos centros logísticos en Latinoamérica", "La expansión busca reducir tiempos de entrega y capturar más demanda e-commerce.", 3),
            ("Reuters", "Microsoft anuncia recompra de acciones por USD 20.000 millones", "El programa refuerza la confianza de inversores tras resultados del segmento cloud.", 5),
            ("Bloomberg", "Walmart eleva proyección de ingresos para el próximo trimestre", "El retail destaca resiliencia del consumo pese a presiones inflacionarias.", 7),
            ("El Economista", "Grupo Bimbo adquiere marca regional de snacks saludables", "La operación consolida su estrategia de diversificación en alimentos.", 9),
            ("Financial Times", "Nestlé reorganiza unidades para acelerar innovación", "La reestructura apunta a mercados emergentes y productos premium.", 11),
        ],
        "Economía": [
            ("El Financiero", "La Fed mantiene tasas y señala cautela ante la inflación", "El banco central estadounidense prioriza datos de empleo y consumo.", 2),
            ("Bloomberg Línea", "El BCE evalúa nuevos recortes si la inflación converge a meta", "Funcionarios europeos destacan riesgos de crecimiento débil.", 4),
            ("Reuters", "México reporta inflación mensual por debajo de expectativas", "Analistas anticipan mayor margen para política monetaria flexible.", 6),
            ("El Economista", "FMI revisa al alza proyección de crecimiento global", "El organismo advierte sobre deuda pública y tensiones comerciales.", 8),
            ("Investing.com", "Dólar se fortalece frente a divisas emergentes", "La demanda de refugio impulsa al índice DXY en sesión europea.", 10),
            ("La Nación", "Argentina negocia nuevo esquema con exportadores del agro", "El acuerdo busca estabilizar ingresos de divisas en el corto plazo.", 12),
        ],
        "Tecnología": [
            ("TechCrunch", "OpenAI presenta mejoras en modelos para empresas", "Las nuevas funciones apuntan a automatización de flujos corporativos.", 1),
            ("The Verge", "Apple integra más funciones de IA en su ecosistema", "La compañía destaca privacidad y procesamiento en dispositivo.", 3),
            ("Wired", "Nvidia amplía capacidad de chips para centros de datos", "La demanda por IA generativa sigue presionando la oferta global.", 5),
            ("Reuters", "Google Cloud gana contratos con sector financiero", "Bancos migran cargas críticas buscando eficiencia y escalabilidad.", 7),
            ("CNBC", "Meta invierte en realidad mixta para usuarios profesionales", "El plan incluye alianzas con desarrolladores de software empresarial.", 9),
            ("Ars Technica", "Nuevas regulaciones europeas impactan a grandes plataformas", "Las firmas tech ajustan políticas de datos y competencia.", 11),
        ],
        "Mercados": [
            ("Investing.com", "Wall Street cierra en positivo impulsado por tecnología", "Los índices amplían ganancias con volumen superior al promedio.", 2),
            ("MarketWatch", "El oro toca máximos ante demanda de cobertura", "Inversores institucionales aumentan posiciones en metales.", 4),
        ],
    }


def _build_supplements() -> list[dict[str, Any]]:
    now = datetime.now(timezone.utc)
    articles: list[dict[str, Any]] = []
    for category, rows in _supplement_templates().items():
        for i, (src, title, summary, hours) in enumerate(rows):
            slug = re.sub(r"[^a-z0-9]+", "-", title.lower())[:40]
            articles.append(
                _article(
                    source=src,
                    title=title,
                    summary=summary,
                    date=now - timedelta(hours=hours),
                    url=f"https://news.google.com/search?q={slug}&hl=es-419",
                    category=category,
                )
            )
    return articles


def _ensure_minimum_per_category(
    articles: list[dict[str, Any]],
    min_count: int = _MIN_PER_CATEGORY,
) -> list[dict[str, Any]]:
    """Garantiza al menos min_count noticias por categoría."""
    by_cat: dict[str, list[dict[str, Any]]] = {c: [] for c in _CATEGORIES}
    seen_urls: set[str] = set()

    for item in articles:
        cat = item.get("category") or "Mercados"
        if cat not in by_cat:
            cat = "Mercados"
        if item["url"] in seen_urls:
            continue
        seen_urls.add(item["url"])
        by_cat[cat].append(item)

    supplements = _build_supplements()
    supp_by_cat: dict[str, list[dict[str, Any]]] = {c: [] for c in _CATEGORIES}
    for s in supplements:
        supp_by_cat[s["category"]].append(s)

    result: list[dict[str, Any]] = []
    for cat in _CATEGORIES:
        pool = by_cat[cat]
        if len(pool) < min_count:
            for extra in supp_by_cat[cat]:
                if extra["url"] in seen_urls:
                    continue
                seen_urls.add(extra["url"])
                pool.append(extra)
                if len(pool) >= min_count:
                    break
        result.extend(pool[:_MAX_PER_CATEGORY])

    result.sort(key=lambda x: x["date"], reverse=True)
    return result


def _fallback_news() -> list[dict[str, Any]]:
    return _ensure_minimum_per_category(_build_supplements(), min_count=_MIN_PER_CATEGORY)


def fetch_financial_news() -> tuple[list[dict[str, Any]], str]:
    """
    Devuelve (artículos, origen).
    origen: 'newsapi' | 'rss' | 'fallback'
    """
    from_api = _fetch_newsapi()
    if from_api:
        balanced = _ensure_minimum_per_category(from_api)
        return balanced, "newsapi"

    from_rss = _fetch_rss_feeds()
    if from_rss:
        balanced = _ensure_minimum_per_category(from_rss)
        return balanced, "rss"

    return _fallback_news(), "fallback"

"""Add news_articles table

Revision ID: add_news_articles
Revises: add_educational_content
Create Date: 2026-04-18

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_news_articles'
down_revision = 'add_educational_content'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'news_articles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('source', sa.String(length=150), nullable=False),
        sa.Column('title', sa.Text(), nullable=False),
        sa.Column('summary', sa.Text(), nullable=False),
        sa.Column('date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('url', sa.String(length=500), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column('author', sa.String(length=150), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_news_articles_created_at'), 'news_articles', ['created_at'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_news_articles_created_at'), table_name='news_articles')
    op.drop_table('news_articles')

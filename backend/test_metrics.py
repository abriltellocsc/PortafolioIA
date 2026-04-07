#!/usr/bin/env python3
"""
Test script to verify metrics normalization and portfolio generation
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.services.optimizer_service import (
    normalize_metrics,
    generate_portfolio_static
)

def test_normalize_metrics():
    """Test the normalize_metrics function"""
    print("\n=== Testing normalize_metrics ===")
    
    # Test 1: Devuelve volatility, esperamos que sea convertido a risk
    test1 = {
        "expected_return": 0.10,
        "volatility": 0.05,
        "sharpe_ratio": 2.0,
        "max_drawdown": -0.10
    }
    result1 = normalize_metrics(test1)
    print(f"Test 1 (volatility->risk): {test1}")
    print(f"Result: {result1}")
    assert result1["risk"] == 0.05, f"Expected risk=0.05, got {result1['risk']}"
    assert result1["expected_return"] == 0.10
    
    # Test 2: Devuelve risk directamente
    test2 = {
        "expected_return": 0.12,
        "risk": 0.08,
        "sharpe_ratio": 1.5,
    }
    result2 = normalize_metrics(test2)
    print(f"\nTest 2 (risk directly): {test2}")
    print(f"Result: {result2}")
    assert result2["risk"] == 0.08, f"Expected risk=0.08, got {result2['risk']}"
    
    # Test 3: Manejo de NaN
    test3 = {
        "expected_return": float('nan'),
        "volatility": 0.05,
    }
    result3 = normalize_metrics(test3)
    print(f"\nTest 3 (NaN handling): {test3}")
    print(f"Result: {result3}")
    assert result3["expected_return"] == 0.0, f"Expected expected_return=0.0 for NaN, got {result3['expected_return']}"
    
    print("\n✅ All normalize_metrics tests passed!")

def test_generate_portfolio_static():
    """Test generate_portfolio_static with different profiles"""
    print("\n=== Testing generate_portfolio_static ===")
    
    # Test Low Risk Profile
    low_risk_profile = {
        "risk_level": "low",
        "investment_goal": "retirement",
        "experience_level": "beginner"
    }
    result_low = generate_portfolio_static(low_risk_profile, {})
    print(f"\nLow Risk Profile: {low_risk_profile}")
    print(f"Expected Return: {result_low['metrics']['expected_return']:.4f}")
    print(f"Risk: {result_low['metrics']['risk']:.4f}")
    print(f"Assets: {len(result_low['assets'])} assets selected")
    
    # Low risk should have lower metrics
    assert result_low['metrics']['expected_return'] < 0.08, "Low risk return should be low"
    assert result_low['metrics']['risk'] < 0.06, "Low risk should be low"
    
    # Test High Risk Profile
    high_risk_profile = {
        "risk_level": "high",
        "investment_goal": "growth",
        "experience_level": "advanced"
    }
    result_high = generate_portfolio_static(high_risk_profile, {})
    print(f"\nHigh Risk Profile: {high_risk_profile}")
    print(f"Expected Return: {result_high['metrics']['expected_return']:.4f}")
    print(f"Risk: {result_high['metrics']['risk']:.4f}")
    print(f"Assets: {len(result_high['assets'])} assets selected")
    
    # High risk should have higher metrics
    assert result_high['metrics']['expected_return'] > result_low['metrics']['expected_return'], \
        f"High risk return ({result_high['metrics']['expected_return']}) should be > low risk ({result_low['metrics']['expected_return']})"
    assert result_high['metrics']['risk'] > result_low['metrics']['risk'], \
        f"High risk ({result_high['metrics']['risk']}) should be > low risk ({result_low['metrics']['risk']})"
    
    print("\n✅ All generate_portfolio_static tests passed!")

if __name__ == "__main__":
    try:
        test_normalize_metrics()
        test_generate_portfolio_static()
        print("\n" + "="*50)
        print("✅ All tests passed successfully!")
        print("="*50)
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

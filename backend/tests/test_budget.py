"""The installation-wide budget must hold when chat requests arrive together."""
from concurrent.futures import ThreadPoolExecutor

from app import db


def test_budget_reservations_are_atomic():
    with ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(lambda _: db.reserve_llm_call(5), range(24)))
    assert sum(results) == 5
    assert db.get_llm_calls() == 5
    assert db.reserve_llm_call(5) is False


def test_zero_budget_never_reserves():
    assert db.reserve_llm_call(0) is False
    assert db.get_llm_calls() == 0

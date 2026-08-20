from src.common.process_helpers import ProcessHelpers


def test_generate_otp():
    otp = ProcessHelpers.generate_otp(6)
    assert len(otp) == 6
    assert otp.isdigit()


def test_generate_slug():
    slug = ProcessHelpers.generate_slug(" Vedic Kundli & Astrology ")
    assert slug == "vedic-kundli-astrology"


def test_pagination():
    res = ProcessHelpers.paginate(page=2, limit=10)
    assert res["skip"] == 10
    assert res["limit"] == 10

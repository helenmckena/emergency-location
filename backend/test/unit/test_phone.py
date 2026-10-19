import pytest
from services.phone import PhoneService
from core.exceptions import InvalidPhoneFormatError


class TestPhoneServiceParse:
    def test_parse_valid_international_number(self) -> None:
        result = PhoneService.parse("+77000000000")
        assert result.country_code == 7

    def test_parse_without_plus_raises(self) -> None:
        with pytest.raises(
            InvalidPhoneFormatError, match=r"must be in international format"
        ):
            PhoneService.parse("77000000000")

    def test_parse_invalid_number_raises(self) -> None:
        with pytest.raises(InvalidPhoneFormatError):
            PhoneService.parse("+7abc")


class TestPhoneServiceIsValid:
    def test_is_valid_true(self) -> None:
        assert PhoneService.is_valid("+77000000000") is True

    def test_is_valid_false_wrong_format(self) -> None:
        assert PhoneService.is_valid("77000000000") is False

    def test_is_valid_false_invalid_number(self) -> None:
        assert PhoneService.is_valid("+7700") is False


class TestPhoneServiceNormalize:
    def test_remove_spaces(self) -> None:
        assert PhoneService.normalize("+7 700 000 00 00") == "+77000000000"

    def test_national_prefix_kz_8_to_plus7(self) -> None:
        assert PhoneService.normalize("87000000000") == "+77000000000"

    def test_national_prefix_ru_8_to_plus7(self) -> None:
        assert PhoneService.normalize("89000000000") == "+79000000000"

    def test_already_international_unchanged(self) -> None:
        assert PhoneService.normalize("+77000000000") == "+77000000000"

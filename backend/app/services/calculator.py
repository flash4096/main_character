import calendar
from datetime import datetime, date, time, timezone, timedelta
from typing import Tuple, Dict, Any


def calculate_current_age(birth_date: date, now: datetime) -> Dict[str, Any]:
    birth_dt = datetime.combine(birth_date, time.min, tzinfo=timezone.utc)
    
    # Calculate difference
    years = now.year - birth_dt.year
    months = now.month - birth_dt.month
    days = now.day - birth_dt.day
    hours = now.hour
    minutes = now.minute
    seconds = now.second

    if seconds < 0:
        minutes -= 1
        seconds += 60
    if minutes < 0:
        hours -= 1
        minutes += 60
    if hours < 0:
        days -= 1
        hours += 24
    if days < 0:
        months -= 1
        # Get days in previous month
        prev_month = now.month - 1 if now.month > 1 else 12
        prev_year = now.year if now.month > 1 else now.year - 1
        _, days_in_prev_month = calendar.monthrange(prev_year, prev_month)
        days += days_in_prev_month
    if months < 0:
        years -= 1
        months += 12

    total_seconds = (now - birth_dt).total_seconds()
    total_years = total_seconds / (365.2425 * 86400)

    return {
        "years": max(0, years),
        "months": max(0, months),
        "days": max(0, days),
        "hours": max(0, hours),
        "minutes": max(0, minutes),
        "seconds": max(0, seconds),
        "total_seconds": max(0.0, total_seconds),
        "total_years": round(max(0.0, total_years), 6),
    }


def calculate_remaining_life(birth_date: date, expected_life_years: int, now: datetime) -> Tuple[Dict[str, Any], float, bool]:
    # Estimated death date
    birth_dt = datetime.combine(birth_date, time.min, tzinfo=timezone.utc)
    target_days = expected_life_years * 365.2425
    estimated_death = birth_dt + timedelta(days=target_days)

    remaining_delta = estimated_death - now
    remaining_seconds = remaining_delta.total_seconds()

    if remaining_seconds <= 0:
        return (
            {"years": 0, "months": 0, "days": 0, "total_days": 0},
            0.0,
            True,
        )

    # Remaining years, months, days
    total_days = int(remaining_delta.days)
    
    # Calculate detailed remaining breakdown
    rem_years = estimated_death.year - now.year
    rem_months = estimated_death.month - now.month
    rem_days = estimated_death.day - now.day

    if rem_days < 0:
        rem_months -= 1
        _, days_in_month = calendar.monthrange(now.year, now.month)
        rem_days += days_in_month
    if rem_months < 0:
        rem_years -= 1
        rem_months += 12

    return (
        {
            "years": max(0, rem_years),
            "months": max(0, rem_months),
            "days": max(0, rem_days),
            "total_days": max(0, total_days),
        },
        round(remaining_seconds, 2),
        False,
    )


def calculate_time_progress(now: datetime) -> Dict[str, Any]:
    # 1. Year Progress
    start_of_year = datetime(now.year, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
    is_leap = calendar.isleap(now.year)
    days_in_year = 366 if is_leap else 365
    end_of_year = start_of_year + timedelta(days=days_in_year)
    
    year_elapsed = (now - start_of_year).total_seconds()
    year_total = (end_of_year - start_of_year).total_seconds()
    year_progress = round((year_elapsed / year_total) * 100, 4)

    # 2. Month Progress
    _, days_in_month = calendar.monthrange(now.year, now.month)
    start_of_month = datetime(now.year, now.month, 1, 0, 0, 0, tzinfo=timezone.utc)
    end_of_month = start_of_month + timedelta(days=days_in_month)

    month_elapsed = (now - start_of_month).total_seconds()
    month_total = (end_of_month - start_of_month).total_seconds()
    month_progress = round((month_elapsed / month_total) * 100, 4)

    # 3. Day Progress
    seconds_in_day = now.hour * 3600 + now.minute * 60 + now.second + (now.microsecond / 1_000_000)
    day_progress = round((seconds_in_day / 86400.0) * 100, 4)

    month_name = calendar.month_name[now.month]

    return {
        "year": now.year,
        "year_progress_percent": min(100.0, max(0.0, year_progress)),
        "month_name": month_name,
        "month_progress_percent": min(100.0, max(0.0, month_progress)),
        "day_progress_percent": min(100.0, max(0.0, day_progress)),
    }

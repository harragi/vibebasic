#!/usr/bin/env python3
"""
seed_mappings.py

One-time script to generate field_mappings.json from existing data sources:
  - categories_v2.json (taxonomy definition)
  - validate_schema_vs_taxonomy.py (TAXONOMY_TO_DDL mapping)
  - validate_enum_values.py (TAXONOMY_FIELD_TO_DDL_ENUM mapping)
  - DDL SQL files (IPEDS source comments per column)

Run: python seed_mappings.py
Output: field_mappings.json in the same directory
"""

import json
import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent  # data_import/
TAXONOMY_PATH = BASE_DIR / "reference" / "categories_v2.json"
SCHEMA_DIR = BASE_DIR / "schema"
OUTPUT_PATH = Path(__file__).resolve().parent / "field_mappings.json"

# ---------------------------------------------------------------------------
# Import mappings from validation scripts (inline copies to avoid import issues)
# ---------------------------------------------------------------------------

# From validate_schema_vs_taxonomy.py
TAXONOMY_TO_DDL: dict[str, dict] = {
    "institution.institution_control": {"table": "di_institutions", "column": "institution_control"},
    "institution.institution_level": {"table": "di_institutions", "column": "institution_level"},
    "institution.degree_levels": {"table": "di_institutions", "column": "degree_levels"},
    "academic_environment.calendar_model": {"table": "di_academic_environment", "column": "calendar_model"},
    "academic_environment.teacher_profile": {"table": "di_academic_environment", "column": "teacher_profile"},
    "admissions_difficulty.testing_policy": {"table": "di_admissions", "column": "testing_policy"},
    "admissions_difficulty.admissions_factor_rigor_of_secondary_school_record": {"table": "di_admissions_factors", "column": "factor_rigor_of_secondary_school_record"},
    "admissions_difficulty.admissions_factor_class_rank": {"table": "di_admissions_factors", "column": "factor_class_rank"},
    "admissions_difficulty.admissions_factor_academic_gpa": {"table": "di_admissions_factors", "column": "factor_academic_gpa"},
    "admissions_difficulty.admissions_factor_standardized_test_scores": {"table": "di_admissions_factors", "column": "factor_standardized_test_scores"},
    "admissions_difficulty.admissions_factor_application_essay": {"table": "di_admissions_factors", "column": "factor_application_essay"},
    "admissions_difficulty.admissions_factor_recommendations": {"table": "di_admissions_factors", "column": "factor_recommendations"},
    "admissions_difficulty.admissions_factor_interview": {"table": "di_admissions_factors", "column": "factor_interview"},
    "admissions_difficulty.admissions_factor_extracurricular_activities": {"table": "di_admissions_factors", "column": "factor_extracurricular_activities"},
    "admissions_difficulty.admissions_factor_talent_ability": {"table": "di_admissions_factors", "column": "factor_talent_ability"},
    "admissions_difficulty.admissions_factor_character_personal_qualities": {"table": "di_admissions_factors", "column": "factor_character_personal_qualities"},
    "admissions_difficulty.admissions_factor_first_generation": {"table": "di_admissions_factors", "column": "factor_first_generation"},
    "admissions_difficulty.admissions_factor_alumni_relation": {"table": "di_admissions_factors", "column": "factor_alumni_relation"},
    "admissions_difficulty.admissions_factor_geographical_residence": {"table": "di_admissions_factors", "column": "factor_geographical_residence"},
    "admissions_difficulty.admissions_factor_state_residency": {"table": "di_admissions_factors", "column": "factor_state_residency"},
    "admissions_difficulty.admissions_factor_religious_affiliation_commitment": {"table": "di_admissions_factors", "column": "factor_religious_affiliation_commitment"},
    "admissions_difficulty.admissions_factor_volunteer_work": {"table": "di_admissions_factors", "column": "factor_volunteer_work"},
    "admissions_difficulty.admissions_factor_work_experience": {"table": "di_admissions_factors", "column": "factor_work_experience"},
    "campus_life.on_campus_housing_capacity": {"table": "di_campus_life", "column": "on_campus_housing_capacity"},
    "location.campus_setting": {"table": "di_location", "column": "campus_setting"},
    "location.locale_code": {"table": "di_location", "column": "locale_code"},
    "location.locale_group": {"table": "di_location", "column": "locale_group"},
    "location.metro_area": {"table": "di_location", "column": "metro_area"},
    "location.state": {"table": "di_location", "column": "state"},
    "location.us_region": {"table": "di_location", "column": "us_region"},
    "majors.specialized_degrees": {"table": "di_institution_specialized_degrees", "column": "specialized_degree", "note": "junction table"},
    "majors.major_clusters": {"table": "di_institution_major_clusters", "column": "major_cluster", "note": "junction table"},
    "majors.major_cluster_popularity_top_5": {"table": "di_institution_major_clusters", "column": "is_top_5", "note": "boolean flag in junction table"},
    "majors.majors": {"table": "di_institution_majors", "column": "major_name", "note": "junction table"},
    "majors.major_popularity_top_5": {"table": "di_institution_majors", "column": "is_top_5", "note": "boolean flag in junction table"},
    "outcomes.graduation_rate_4yr_band": {"table": "di_outcomes", "column": "graduation_rate_4yr_band"},
    "outcomes.graduation_rate_6yr_band": {"table": "di_outcomes", "column": "graduation_rate_6yr_band"},
    "outcomes.retention_rate_band": {"table": "di_outcomes", "column": "retention_rate_band"},
    "religion_ethnicity_diversity.gender_composition": {"table": "di_enrollment", "column": "gender_composition"},
    "religion_ethnicity_diversity.proportion_american_indian_or_alaska_native": {"table": "di_enrollment_demographics", "column": "prop_aian_band"},
    "religion_ethnicity_diversity.proportion_asian": {"table": "di_enrollment_demographics", "column": "prop_asian_band"},
    "religion_ethnicity_diversity.proportion_black_or_african_american": {"table": "di_enrollment_demographics", "column": "prop_black_band"},
    "religion_ethnicity_diversity.proportion_hispanic_latino": {"table": "di_enrollment_demographics", "column": "prop_hispanic_band"},
    "religion_ethnicity_diversity.proportion_native_hawaiian_or_other_pacific_islander": {"table": "di_enrollment_demographics", "column": "prop_nhpi_band"},
    "religion_ethnicity_diversity.proportion_white": {"table": "di_enrollment_demographics", "column": "prop_white_band"},
    "religion_ethnicity_diversity.proportion_two_or_more_races": {"table": "di_enrollment_demographics", "column": "prop_two_or_more_band"},
    "religion_ethnicity_diversity.proportion_race_and_ethnicity_unknown": {"table": "di_enrollment_demographics", "column": "prop_unknown_band"},
    "religion_ethnicity_diversity.proportion_us_non_resident": {"table": "di_enrollment_demographics", "column": "prop_nonresident_band"},
    "religion_ethnicity_diversity.mission_designations": {"table": "di_institution_mission_designations", "column": "designation", "note": "junction table"},
    "religion_ethnicity_diversity.religious_affiliation": {"table": "di_classifications", "column": "religious_affiliation"},
    "religion_ethnicity_diversity.average_age": {"table": "di_enrollment", "column": "average_age_band"},
    "reputation_rankings.research_spending_and_doctorate_production": {"table": "di_classifications", "column": "research_level"},
    "reputation_rankings.grant_designations": {"table": "di_institution_grant_designations", "column": "grant_designation", "note": "junction table"},
    "size.graduate_enrollment_band": {"table": "di_enrollment", "column": "graduate_enrollment_band"},
    "size.student_faculty_ratio_band": {"table": "di_enrollment", "column": "student_faculty_ratio_band"},
    "size.undergraduate_enrollment_band": {"table": "di_enrollment", "column": "undergraduate_enrollment_band"},
    "size.first_year_undergrad_enrollment_band": {"table": "di_enrollment", "column": "first_year_enrollment_band"},
    "size.undergrad_full_time_student_enrollment": {"table": "di_enrollment", "column": "undergrad_full_time_band"},
    "size.undergrad_part_time_student_enrollment": {"table": "di_enrollment", "column": "undergrad_part_time_band"},
    "size.undergrad_online_student_enrollment": {"table": "di_enrollment", "column": "undergrad_online_band"},
    "size.pct_of_students_out_of_state": {"table": "di_enrollment", "column": "pct_out_of_state_band"},
}

# From validate_enum_values.py
TAXONOMY_FIELD_TO_DDL_ENUM: dict[str, str] = {
    "institution.institution_control": "di_institution_control_enum",
    "institution.institution_level": "di_institution_level_enum",
    "institution.degree_levels": "di_degree_levels_enum",
    "academic_environment.calendar_model": "di_calendar_model_enum",
    "academic_environment.teacher_profile": "di_teacher_profile_enum",
    "admissions_difficulty.acceptance_rate": "di_acceptance_rate_enum",
    "admissions_difficulty.testing_policy": "di_testing_policy_enum",
    "admissions_difficulty.application_volume": "di_application_volume_enum",
    "admissions_difficulty.in_state_application_volume": "di_application_volume_enum",
    "admissions_difficulty.out_of_state_application_volume": "di_application_volume_enum",
    "admissions_difficulty.in_state_acceptance_rate": "di_acceptance_rate_enum",
    "admissions_difficulty.out_of_state_acceptance_rate": "di_acceptance_rate_enum",
    "admissions_difficulty.yield": "di_yield_enum",
    "admissions_difficulty.ed_acceptance_rate": "di_ed_rate_enum",
    "admissions_difficulty.ed_ratio_among_enrolled": "di_ed_rate_enum",
    "admissions_difficulty.ed_to_rd_ratio": "di_ed_to_rd_ratio_enum",
    "admissions_difficulty.sat_composite_score_75_quartile": "di_sat_composite_enum",
    "admissions_difficulty.sat_composite_score_25_quartile": "di_sat_composite_enum",
    "admissions_difficulty.act_composite_score_75_quartile": "di_act_composite_enum",
    "admissions_difficulty.act_composite_score_25_quartile": "di_act_composite_enum",
    "admissions_difficulty.pct_submitting_sat_among_enrolled": "di_pct_submitting_test_enum",
    "admissions_difficulty.pct_submitting_act_among_enrolled": "di_pct_submitting_test_enum",
    "admissions_difficulty.gpa_4_0_plus": "di_gpa_pct_enum",
    "admissions_difficulty.gpa_3_75_4_0": "di_gpa_pct_enum",
    "admissions_difficulty.gpa_3_5_3_74": "di_gpa_pct_enum",
    "admissions_difficulty.gpa_3_25_3_49": "di_gpa_pct_enum",
    "admissions_difficulty.gpa_3_0_3_24": "di_gpa_pct_enum",
    "admissions_difficulty.gpa_below_3_0": "di_gpa_pct_enum",
    "admissions_difficulty.admissions_factor_rigor_of_secondary_school_record": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_class_rank": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_academic_gpa": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_standardized_test_scores": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_application_essay": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_recommendations": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_interview": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_extracurricular_activities": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_talent_ability": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_character_personal_qualities": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_first_generation": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_alumni_relation": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_geographical_residence": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_state_residency": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_religious_affiliation_commitment": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_volunteer_work": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_work_experience": "di_admissions_factor_enum",
    "admissions_difficulty.admissions_factor_demonstrated_interest": "di_admissions_factor_enum",
    "campus_life.on_campus_housing_capacity": "di_housing_capacity_enum",
    "location.campus_setting": "di_campus_setting_enum",
    "cost_financial.in_state_tuition_band": "di_tuition_band_enum",
    "cost_financial.out_of_state_tuition_band": "di_tuition_band_enum",
    "cost_financial.total_cost_of_attendance_in_state": "di_coa_band_enum",
    "cost_financial.total_cost_of_attendance_out_of_state": "di_coa_band_enum",
    "cost_financial.avg_net_price_income_0_30k": "di_net_price_band_enum",
    "cost_financial.avg_net_price_income_30_48k": "di_net_price_band_enum",
    "cost_financial.avg_net_price_income_48_75k": "di_net_price_band_enum",
    "cost_financial.avg_net_price_income_75_110k": "di_net_price_band_enum",
    "cost_financial.avg_net_price_income_over_110k": "di_net_price_band_enum",
    "majors.specialized_degrees": "di_specialized_degree_enum",
    "majors.major_clusters": "di_major_cluster_enum",
    "majors.major_cluster_popularity_top_5": "di_major_cluster_enum",
    "outcomes.graduation_rate_4yr_band": "di_rate_band_enum",
    "outcomes.graduation_rate_6yr_band": "di_rate_band_enum",
    "outcomes.retention_rate_band": "di_rate_band_enum",
    "religion_ethnicity_diversity.gender_composition": "di_gender_composition_enum",
    "religion_ethnicity_diversity.proportion_american_indian_or_alaska_native": "di_demographic_proportion_enum",
    "religion_ethnicity_diversity.proportion_asian": "di_demographic_proportion_enum",
    "religion_ethnicity_diversity.proportion_black_or_african_american": "di_demographic_proportion_enum",
    "religion_ethnicity_diversity.proportion_hispanic_latino": "di_demographic_proportion_enum",
    "religion_ethnicity_diversity.proportion_native_hawaiian_or_other_pacific_islander": "di_demographic_proportion_enum",
    "religion_ethnicity_diversity.proportion_white": "di_demographic_proportion_enum",
    "religion_ethnicity_diversity.proportion_two_or_more_races": "di_demographic_proportion_enum",
    "religion_ethnicity_diversity.proportion_race_and_ethnicity_unknown": "di_demographic_proportion_enum",
    "religion_ethnicity_diversity.proportion_us_non_resident": "di_demographic_proportion_enum",
    "religion_ethnicity_diversity.mission_designations": "di_mission_designation_enum",
    "religion_ethnicity_diversity.average_age": "di_average_age_enum",
    "reputation_rankings.research_spending_and_doctorate_production": "di_research_level_enum",
    "reputation_rankings.grant_designations": "di_grant_designation_enum",
    "size.undergraduate_enrollment_band": "di_enrollment_band_enum",
    "size.first_year_undergrad_enrollment_band": "di_enrollment_band_enum",
    "size.undergrad_full_time_student_enrollment": "di_enrollment_band_enum",
    "size.undergrad_part_time_student_enrollment": "di_enrollment_band_enum",
    "size.undergrad_online_student_enrollment": "di_enrollment_band_enum",
    "size.graduate_enrollment_band": "di_graduate_enrollment_band_enum",
    "size.student_faculty_ratio_band": "di_student_faculty_ratio_enum",
    "size.pct_of_students_out_of_state": "di_demographic_proportion_enum",
}

# Known IPEDS source info per DDL column (extracted from SQL comments)
# Format: "table.column" -> {"ipeds_table": "XX", "ipeds_column": "YY", "transformation": "..."}
IPEDS_SOURCE_INFO: dict[str, dict] = {
    "di_institutions.institution_control": {"ipeds_table": "HD", "ipeds_column": "CONTROL", "transformation": "1->Public, 2->Private Nonprofit, 3->Private For Profit"},
    "di_institutions.institution_level": {"ipeds_table": "HD", "ipeds_column": "ICLEVEL", "transformation": "1->Four Year, 2->Two Year, 3->Less than 2yr"},
    "di_institutions.degree_levels": {"ipeds_table": "HD", "ipeds_column": "HLOFFER+UGOFFER+GROFFER", "transformation": "Combined logic from 3 fields"},
    "di_academic_environment.calendar_model": {"ipeds_table": "IC", "ipeds_column": "CALSYS", "transformation": "1->Semester, 2->Quarter, 3->Trimester, 4->4-1-4"},
    "di_academic_environment.teacher_profile": {"ipeds_table": "EF", "ipeds_column": "STUFACR", "transformation": "Derived heuristic from ratio + R1 status"},
    "di_admissions.testing_policy": {"ipeds_table": "ADM", "ipeds_column": "TESTPOL", "transformation": "1->Required, 2->Recommended, 3->Neither, 5->Optional, 6->Blind"},
    "di_admissions.acceptance_rate_band": {"ipeds_table": "ADM", "ipeds_column": "APPLCN,ADMSSN", "transformation": "Derived: ADMSSN/APPLCN * 100, then bucketed"},
    "di_admissions.sat_composite_25_band": {"ipeds_table": "ADM", "ipeds_column": "SATVR25+SATMT25", "transformation": "Sum of ERW+Math 25th percentile, bucketed"},
    "di_admissions.sat_composite_75_band": {"ipeds_table": "ADM", "ipeds_column": "SATVR75+SATMT75", "transformation": "Sum of ERW+Math 75th percentile, bucketed"},
    "di_admissions.act_composite_25_band": {"ipeds_table": "ADM", "ipeds_column": "ACTCM25", "transformation": "ACT Composite 25th percentile, bucketed"},
    "di_admissions.act_composite_75_band": {"ipeds_table": "ADM", "ipeds_column": "ACTCM75", "transformation": "ACT Composite 75th percentile, bucketed"},
    "di_admissions.pct_submitting_sat_band": {"ipeds_table": "ADM", "ipeds_column": "SATPCT", "transformation": "Percentage bucketed"},
    "di_admissions.pct_submitting_act_band": {"ipeds_table": "ADM", "ipeds_column": "ACTPCT", "transformation": "Percentage bucketed"},
    "di_admissions.yield_band": {"ipeds_table": "ADM", "ipeds_column": "ENRLT,ADMSSN", "transformation": "Derived: ENRLT/ADMSSN * 100, bucketed"},
    "di_admissions_factors.factor_rigor_of_secondary_school_record": {"ipeds_table": "IC/ADM", "ipeds_column": "ADMCON3", "transformation": "IPEDS 3-level -> CDS 5-level scale"},
    "di_admissions_factors.factor_class_rank": {"ipeds_table": "IC/ADM", "ipeds_column": "ADMCON2", "transformation": "IPEDS 3-level -> CDS 5-level scale"},
    "di_admissions_factors.factor_academic_gpa": {"ipeds_table": "IC/ADM", "ipeds_column": "ADMCON1", "transformation": "IPEDS 3-level -> CDS 5-level scale"},
    "di_admissions_factors.factor_standardized_test_scores": {"ipeds_table": "IC/ADM", "ipeds_column": "ADMCON7", "transformation": "IPEDS 3-level -> CDS 5-level scale"},
    "di_admissions_factors.factor_application_essay": {"ipeds_table": "IC/ADM", "ipeds_column": "ADMCON11", "transformation": "IPEDS 3-level -> CDS 5-level scale"},
    "di_admissions_factors.factor_recommendations": {"ipeds_table": "IC/ADM", "ipeds_column": "ADMCON5", "transformation": "IPEDS 3-level -> CDS 5-level scale"},
    "di_admissions_factors.factor_interview": {"ipeds_table": "IC/ADM", "ipeds_column": "", "transformation": "CDS-sourced; no direct IPEDS variable"},
    "di_admissions_factors.factor_extracurricular_activities": {"ipeds_table": "IC/ADM", "ipeds_column": "", "transformation": "CDS-sourced; no direct IPEDS variable"},
    "di_admissions_factors.factor_talent_ability": {"ipeds_table": "IC/ADM", "ipeds_column": "", "transformation": "CDS-sourced; no direct IPEDS variable"},
    "di_admissions_factors.factor_character_personal_qualities": {"ipeds_table": "IC/ADM", "ipeds_column": "", "transformation": "CDS-sourced; no direct IPEDS variable"},
    "di_admissions_factors.factor_first_generation": {"ipeds_table": "IC/ADM", "ipeds_column": "", "transformation": "CDS-sourced; no direct IPEDS variable"},
    "di_admissions_factors.factor_alumni_relation": {"ipeds_table": "IC/ADM", "ipeds_column": "ADMCON12", "transformation": "IPEDS 3-level -> CDS 5-level scale"},
    "di_admissions_factors.factor_geographical_residence": {"ipeds_table": "IC/ADM", "ipeds_column": "", "transformation": "CDS-sourced; no direct IPEDS variable"},
    "di_admissions_factors.factor_state_residency": {"ipeds_table": "IC/ADM", "ipeds_column": "", "transformation": "CDS-sourced; no direct IPEDS variable"},
    "di_admissions_factors.factor_religious_affiliation_commitment": {"ipeds_table": "IC/ADM", "ipeds_column": "", "transformation": "CDS-sourced; no direct IPEDS variable"},
    "di_admissions_factors.factor_volunteer_work": {"ipeds_table": "IC/ADM", "ipeds_column": "", "transformation": "CDS-sourced; no direct IPEDS variable"},
    "di_admissions_factors.factor_work_experience": {"ipeds_table": "IC/ADM", "ipeds_column": "ADMCON10", "transformation": "IPEDS 3-level -> CDS 5-level scale"},
    "di_campus_life.on_campus_housing_capacity": {"ipeds_table": "IC", "ipeds_column": "ROOMCAP", "transformation": "Bed count bucketed into bands"},
    "di_location.campus_setting": {"ipeds_table": "HD", "ipeds_column": "LOCALE", "transformation": "LOCALE code -> setting via di_ref_locale_codes"},
    "di_location.locale_code": {"ipeds_table": "HD", "ipeds_column": "LOCALE", "transformation": "Pass-through as string"},
    "di_location.locale_group": {"ipeds_table": "HD", "ipeds_column": "LOCALE", "transformation": "First digit: 1->City, 2->Suburb, 3->Town, 4->Rural"},
    "di_location.metro_area": {"ipeds_table": "HD", "ipeds_column": "CBSA", "transformation": "CBSA code -> metropolitan area name"},
    "di_location.state": {"ipeds_table": "HD", "ipeds_column": "STABBR", "transformation": "USPS 2-letter code pass-through"},
    "di_location.us_region": {"ipeds_table": "HD", "ipeds_column": "OBEREG", "transformation": "OBEREG code -> region name"},
    "di_institution_specialized_degrees.specialized_degree": {"ipeds_table": "C", "ipeds_column": "CIPCODE", "transformation": "Derived from CIP code families"},
    "di_institution_major_clusters.major_cluster": {"ipeds_table": "C", "ipeds_column": "CIPCODE", "transformation": "CIP family -> major cluster via mapper"},
    "di_institution_major_clusters.is_top_5": {"ipeds_table": "C", "ipeds_column": "CTOTALT", "transformation": "Rank clusters by completions, top 5 flagged"},
    "di_institution_majors.major_name": {"ipeds_table": "C", "ipeds_column": "CIPCODE", "transformation": "CIP code -> program name via CIPCode2020.csv"},
    "di_institution_majors.is_top_5": {"ipeds_table": "C", "ipeds_column": "CTOTALT", "transformation": "Rank majors by completions, top 5 flagged"},
    "di_outcomes.graduation_rate_4yr_band": {"ipeds_table": "DRVGR", "ipeds_column": "GBA4RTT", "transformation": "Percentage bucketed into rate bands"},
    "di_outcomes.graduation_rate_6yr_band": {"ipeds_table": "DRVGR", "ipeds_column": "GBA6RTT", "transformation": "Percentage bucketed into rate bands"},
    "di_outcomes.retention_rate_band": {"ipeds_table": "EF", "ipeds_column": "RET_PCF", "transformation": "Percentage bucketed into rate bands"},
    "di_enrollment.gender_composition": {"ipeds_table": "EF", "ipeds_column": "EFTOTLM,EFTOTLW", "transformation": "Derived from male/female ratio"},
    "di_enrollment_demographics.prop_aian_band": {"ipeds_table": "EF", "ipeds_column": "UGDS_AIAN", "transformation": "Decimal proportion bucketed"},
    "di_enrollment_demographics.prop_asian_band": {"ipeds_table": "EF", "ipeds_column": "UGDS_ASIAN", "transformation": "Decimal proportion bucketed"},
    "di_enrollment_demographics.prop_black_band": {"ipeds_table": "EF", "ipeds_column": "UGDS_BLACK", "transformation": "Decimal proportion bucketed"},
    "di_enrollment_demographics.prop_hispanic_band": {"ipeds_table": "EF", "ipeds_column": "UGDS_HISP", "transformation": "Decimal proportion bucketed"},
    "di_enrollment_demographics.prop_nhpi_band": {"ipeds_table": "EF", "ipeds_column": "UGDS_NHPI", "transformation": "Decimal proportion bucketed"},
    "di_enrollment_demographics.prop_white_band": {"ipeds_table": "EF", "ipeds_column": "UGDS_WHITE", "transformation": "Decimal proportion bucketed"},
    "di_enrollment_demographics.prop_two_or_more_band": {"ipeds_table": "EF", "ipeds_column": "UGDS_2MOR", "transformation": "Decimal proportion bucketed"},
    "di_enrollment_demographics.prop_unknown_band": {"ipeds_table": "EF", "ipeds_column": "UGDS_UNKN", "transformation": "Decimal proportion bucketed"},
    "di_enrollment_demographics.prop_nonresident_band": {"ipeds_table": "EF", "ipeds_column": "UGDS_NRA", "transformation": "Decimal proportion bucketed"},
    "di_institution_mission_designations.designation": {"ipeds_table": "HD", "ipeds_column": "HBCU,TRIBAL,LANDGRNT+Scorecard", "transformation": "Multiple IPEDS flags + Scorecard UGDS_*"},
    "di_classifications.religious_affiliation": {"ipeds_table": "IC", "ipeds_column": "RELAFFIL", "transformation": "RELAFFIL code -> denomination name"},
    "di_enrollment.average_age_band": {"ipeds_table": "EF", "ipeds_column": "age distribution", "transformation": "EF age groups or Scorecard"},
    "di_classifications.research_level": {"ipeds_table": "HD", "ipeds_column": "C21BASIC", "transformation": "15->R1, 16->R2, others->Moderate/N/A"},
    "di_institution_grant_designations.grant_designation": {"ipeds_table": "HD", "ipeds_column": "LANDGRNT+external", "transformation": "IPEDS Land Grant + NOAA Sea Grant + NASA Space Grant"},
    "di_enrollment.graduate_enrollment_band": {"ipeds_table": "DRVEF", "ipeds_column": "EFGRAD", "transformation": "Total grad enrollment bucketed"},
    "di_enrollment.student_faculty_ratio_band": {"ipeds_table": "EF", "ipeds_column": "STUFACR", "transformation": "Ratio bucketed into bands"},
    "di_enrollment.undergraduate_enrollment_band": {"ipeds_table": "DRVEF", "ipeds_column": "EFUG", "transformation": "Total undergrad enrollment bucketed"},
    "di_enrollment.first_year_enrollment_band": {"ipeds_table": "EF/ADM", "ipeds_column": "ENRLT", "transformation": "First-time degree-seeking count bucketed"},
    "di_enrollment.undergrad_full_time_band": {"ipeds_table": "EF", "ipeds_column": "EF full-time UG", "transformation": "Full-time undergrad count bucketed"},
    "di_enrollment.undergrad_part_time_band": {"ipeds_table": "EF", "ipeds_column": "EF part-time UG", "transformation": "Part-time undergrad count bucketed"},
    "di_enrollment.undergrad_online_band": {"ipeds_table": "EFDE", "ipeds_column": "EFDE distance ed", "transformation": "Exclusively online undergrad count bucketed"},
    "di_enrollment.pct_out_of_state_band": {"ipeds_table": "EF", "ipeds_column": "EF residency", "transformation": "Percentage out-of-state bucketed"},
    "di_financial.in_state_tuition_band": {"ipeds_table": "DRVIC", "ipeds_column": "TUFEYR2", "transformation": "Dollar amount bucketed into tuition bands"},
    "di_financial.out_of_state_tuition_band": {"ipeds_table": "DRVIC", "ipeds_column": "TUFEYR3", "transformation": "Dollar amount bucketed into tuition bands"},
    "di_financial.coa_in_state_band": {"ipeds_table": "DRVIC/IC_AY", "ipeds_column": "COA components", "transformation": "Sum of tuition+room+board+books bucketed"},
    "di_financial.coa_out_of_state_band": {"ipeds_table": "DRVIC/IC_AY", "ipeds_column": "COA components", "transformation": "Sum of tuition+room+board+books bucketed"},
    "di_financial.net_price_0_30k_band": {"ipeds_table": "SFA", "ipeds_column": "NPT41", "transformation": "Dollar amount bucketed"},
    "di_financial.net_price_30_48k_band": {"ipeds_table": "SFA", "ipeds_column": "NPT42", "transformation": "Dollar amount bucketed"},
    "di_financial.net_price_48_75k_band": {"ipeds_table": "SFA", "ipeds_column": "NPT43", "transformation": "Dollar amount bucketed"},
    "di_financial.net_price_75_110k_band": {"ipeds_table": "SFA", "ipeds_column": "NPT44", "transformation": "Dollar amount bucketed"},
    "di_financial.net_price_over_110k_band": {"ipeds_table": "SFA", "ipeds_column": "NPT45", "transformation": "Dollar amount bucketed"},
}


def load_taxonomy() -> dict:
    """Load categories_v2.json and return the full taxonomy."""
    with open(TAXONOMY_PATH) as f:
        return json.load(f)


def get_ipeds_source(ddl_table: str, ddl_column: str) -> dict:
    """Look up IPEDS source info for a DDL table.column."""
    key = f"{ddl_table}.{ddl_column}"
    return IPEDS_SOURCE_INFO.get(key, {})


def determine_mapping_status(field_key: str, ddl_info: dict | None, ipeds_info: dict) -> str:
    """Determine the mapping status for a field."""
    if ddl_info and ipeds_info.get("ipeds_column"):
        return "Fully Mapped"
    elif ddl_info:
        return "DDL Only"
    else:
        return "Unmapped"


def generate_mappings() -> dict:
    """Generate the full field_mappings.json structure."""
    taxonomy = load_taxonomy()
    categories = taxonomy.get("categories", {})
    fields = {}

    for category_name, category_fields in categories.items():
        for field_name, field_def in category_fields.items():
            field_key = f"{category_name}.{field_name}"

            # Get DDL mapping
            ddl_info = TAXONOMY_TO_DDL.get(field_key)
            ddl_table = ddl_info["table"] if ddl_info else ""
            ddl_column = ddl_info["column"] if ddl_info else ""
            ddl_note = ddl_info.get("note", "") if ddl_info else ""

            # Get enum type
            ddl_enum_type = TAXONOMY_FIELD_TO_DDL_ENUM.get(field_key, "")

            # Get IPEDS source info
            ipeds_info = get_ipeds_source(ddl_table, ddl_column) if ddl_info else {}

            # Determine mapping status
            data_source = field_def.get("data_source", "")
            if ddl_info and ipeds_info.get("ipeds_column"):
                mapping_status = "Fully Mapped"
            elif ddl_info:
                mapping_status = "DDL Only"
            elif data_source in ("LLM + Search", "Athletics Data", "Safety", "SMI"):
                mapping_status = "Non-IPEDS Source"
            else:
                mapping_status = "Unmapped"

            fields[field_key] = {
                "category": category_name,
                "field_name": field_name,
                "display_name": field_def.get("display_name", field_name),
                "description": field_def.get("description", ""),
                "data_source": data_source,
                "type": field_def.get("type", ""),
                "cardinality": field_def.get("cardinality", ""),
                "nullable": field_def.get("nullable", True),
                "values": field_def.get("values", []),
                "ddl_table": ddl_table,
                "ddl_column": ddl_column,
                "ddl_note": ddl_note,
                "ddl_enum_type": ddl_enum_type,
                "ipeds_table": ipeds_info.get("ipeds_table", ""),
                "ipeds_column": ipeds_info.get("ipeds_column", ""),
                "transformation": ipeds_info.get("transformation", ""),
                "mapping_status": mapping_status,
                "notes": field_def.get("notes", ""),
                "modified": False,
            }

    return {
        "version": "1.0",
        "generated_from": "categories_v2.json + DDL schema + validation scripts",
        "fields": fields,
    }


def main() -> int:
    print("Generating field_mappings.json...")
    print(f"  Taxonomy: {TAXONOMY_PATH}")
    print(f"  Schema:   {SCHEMA_DIR}")
    print(f"  Output:   {OUTPUT_PATH}")

    mappings = generate_mappings()
    fields = mappings["fields"]

    # Stats
    total = len(fields)
    fully_mapped = sum(1 for f in fields.values() if f["mapping_status"] == "Fully Mapped")
    ddl_only = sum(1 for f in fields.values() if f["mapping_status"] == "DDL Only")
    unmapped = sum(1 for f in fields.values() if f["mapping_status"] == "Unmapped")
    non_ipeds = sum(1 for f in fields.values() if f["mapping_status"] == "Non-IPEDS Source")

    print(f"\n  Total fields:    {total}")
    print(f"  Fully Mapped:    {fully_mapped}")
    print(f"  DDL Only:        {ddl_only}")
    print(f"  Unmapped:        {unmapped}")
    print(f"  Non-IPEDS:       {non_ipeds}")

    # Categories
    cats = {}
    for f in fields.values():
        cats.setdefault(f["category"], 0)
        cats[f["category"]] += 1
    print(f"\n  Categories ({len(cats)}):")
    for cat in sorted(cats):
        print(f"    {cat}: {cats[cat]} fields")

    with open(OUTPUT_PATH, "w") as f:
        json.dump(mappings, f, indent=2)

    print(f"\nWrote {OUTPUT_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

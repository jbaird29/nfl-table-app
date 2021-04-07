CREATE OR REPLACE TABLE
  `nfl-table.main.team_stats`
CLUSTER BY
  team_id
AS (
  SELECT
    team_id AS team_id,
    team_name AS team_name,
    season_year AS season_year,
    SUM(CASE WHEN true THEN pass_was_completion ELSE NULL END) AS pass_completions_sum,
    SUM(CASE WHEN true THEN pass_was_attempt  ELSE NULL END) AS pass_attempts_sum,
    SUM(CASE WHEN true THEN pass_was_completion ELSE NULL END) / SUM(CASE WHEN true THEN pass_was_attempt  ELSE NULL END) AS pass_completion_percentage,
    SUM(CASE WHEN true THEN pass_yards ELSE NULL END) AS pass_yards_sum,
    SUM(CASE WHEN true THEN pass_yards ELSE NULL END) / SUM(CASE WHEN true THEN pass_was_attempt  ELSE NULL END) AS pass_yards_per_attempt,
    SUM(CASE WHEN true THEN pass_was_touchdown ELSE NULL END) AS pass_touchdowns_sum,
    SUM(CASE WHEN true THEN pass_was_interception ELSE NULL END) AS pass_interceptions_sum,
    100 * ((GREATEST(LEAST((IFNULL(SAFE_DIVIDE(SUM(CASE WHEN true THEN pass_was_completion ELSE NULL END), SUM(CASE WHEN true THEN pass_was_attempt  ELSE NULL END)), 0) - 0.3) * 5.00, 2.375), 0))+(GREATEST(LEAST((IFNULL(SAFE_DIVIDE(SUM(CASE WHEN true THEN pass_yards ELSE NULL END), SUM(CASE WHEN true THEN pass_was_attempt  ELSE NULL END)), 0) - 3.0) * 0.25, 2.375), 0))+(GREATEST(LEAST(IFNULL(SAFE_DIVIDE(SUM(CASE WHEN true THEN pass_was_touchdown ELSE NULL END), SUM(CASE WHEN true THEN pass_was_attempt  ELSE NULL END)), 0) * 20.0, 2.375), 0))+(GREATEST(LEAST(2.375 - (IFNULL(SAFE_DIVIDE(SUM(CASE WHEN true THEN pass_was_interception ELSE NULL END), SUM(CASE WHEN true THEN pass_was_attempt  ELSE NULL END)), 0) * 25.0), 2.375), 0)))/6 AS pass_rating,
    SUM(CASE WHEN true THEN pass_air_yards ELSE NULL END) AS pass_air_yards_sum,
    AVG(CASE WHEN true THEN pass_pocket_time ELSE NULL END) AS pass_pocket_time_average,
    SUM(CASE WHEN true THEN pass_was_sack ELSE NULL END) AS pass_sacked_sum,
    SUM(CASE WHEN true THEN pass_sack_yards ELSE NULL END) AS pass_sack_yards_sum,
    SUM(CASE WHEN true THEN rush_was_attempt  ELSE NULL END) AS rush_attempts_sum,
    SUM(CASE WHEN true THEN rush_yards ELSE NULL END) AS rush_yards_sum,
    SUM(CASE WHEN true THEN rush_yards ELSE NULL END) / SUM(CASE WHEN true THEN rush_was_attempt  ELSE NULL END) AS rush_yards_per_attempt,
    SUM(CASE WHEN true THEN rush_was_touchdown ELSE NULL END) AS rush_touchdowns_sum,
    SUM(CASE WHEN true THEN rush_broken_tackles ELSE NULL END) AS rush_broken_tackles_sum,
    SUM(CASE WHEN true THEN rush_yards_after_contact ELSE NULL END) AS rush_yards_after_contact_sum,
    SUM(CASE WHEN true THEN rush_yards_after_contact ELSE NULL END) / SUM(CASE WHEN true THEN rush_was_attempt  ELSE NULL END) AS rush_yards_after_per_attempt,
    SUM(CASE WHEN true THEN rush_was_tackle_for_loss ELSE NULL END) AS rush_tackle_for_loss_sum,
    SUM(CASE WHEN true THEN rush_tackle_for_loss_yards ELSE NULL END) AS rush_tackle_for_loss_yards_sum,
    SUM(CASE WHEN true THEN rush_was_firstdown ELSE NULL END) AS rush_firstdown_sum,
    SUM(CASE WHEN true THEN recv_was_reception ELSE NULL END) AS recv_receptions_sum,
    SUM(CASE WHEN true THEN recv_was_target ELSE NULL END) AS recv_targets_sum,
    SUM(CASE WHEN true THEN recv_was_reception ELSE NULL END) / SUM(CASE WHEN true THEN recv_was_target ELSE NULL END) AS recv_catch_percentage,
    SUM(CASE WHEN true THEN recv_was_dropped ELSE NULL END) AS recv_dropped_sum,
    SUM(CASE WHEN true THEN recv_was_catchable ELSE NULL END) AS recv_catchable_sum,
    SUM(CASE WHEN true THEN recv_yards ELSE NULL END) AS recv_yards_sum,
    SUM(CASE WHEN true THEN recv_was_touchdown ELSE NULL END) AS recv_touchdowns_sum,
    SUM(CASE WHEN true THEN recv_yards ELSE NULL END) / SUM(CASE WHEN true THEN recv_was_reception ELSE NULL END) AS recv_yards_per_reception,
    SUM(CASE WHEN true THEN recv_yards_after_catch ELSE NULL END) AS recv_yards_after_catch_sum,
    SUM(CASE WHEN true THEN recv_broken_tackles ELSE NULL END) AS recv_broken_tackles_sum,
    SUM(CASE WHEN true THEN recv_yards_after_contact ELSE NULL END) AS recv_yards_after_contact_sum,
  FROM
    `nfl-table.main.prod`
  WHERE nullified IS NULL
  GROUP BY 1, 2, 3
)
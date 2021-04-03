CREATE OR REPLACE TABLE
  `nfl-table.main.player_stats`
PARTITION BY
  RANGE_BUCKET(partition_player_id, GENERATE_ARRAY(1, 3575, 1))
CLUSTER BY
  season_year
AS (
  SELECT
    partition_player_id AS partition_player_id,
    player_name_with_position AS player_name_with_position,
    season_year AS season_year,
    SUM(CASE WHEN true THEN pass_was_completion ELSE NULL END) AS pass_completions_sum,
    SUM(CASE WHEN true THEN pass_was_attempt  ELSE NULL END) AS pass_attempts_sum,
    SUM(CASE WHEN true THEN pass_was_completion ELSE NULL END) / SUM(CASE WHEN true THEN pass_was_attempt  ELSE NULL END) AS pass_completion_percentage,
    SUM(CASE WHEN true THEN pass_yards ELSE NULL END) AS pass_yards_sum,
    SUM(CASE WHEN true THEN pass_was_touchdown ELSE NULL END) AS pass_touchdowns_sum,
    SUM(CASE WHEN true THEN pass_was_interception ELSE NULL END) AS pass_interceptions_sum,
    100 * ((GREATEST(LEAST((IFNULL(SAFE_DIVIDE(SUM(CASE WHEN true THEN pass_was_completion ELSE NULL END), SUM(CASE WHEN true THEN pass_was_attempt  ELSE NULL END)), 0) - 0.3) * 5.00, 2.375), 0))+(GREATEST(LEAST((IFNULL(SAFE_DIVIDE(SUM(CASE WHEN true THEN pass_yards ELSE NULL END), SUM(CASE WHEN true THEN pass_was_attempt  ELSE NULL END)), 0) - 3.0) * 0.25, 2.375), 0))+(GREATEST(LEAST(IFNULL(SAFE_DIVIDE(SUM(CASE WHEN true THEN pass_was_touchdown ELSE NULL END), SUM(CASE WHEN true THEN pass_was_attempt  ELSE NULL END)), 0) * 20.0, 2.375), 0))+(GREATEST(LEAST(2.375 - (IFNULL(SAFE_DIVIDE(SUM(CASE WHEN true THEN pass_was_interception ELSE NULL END), SUM(CASE WHEN true THEN pass_was_attempt  ELSE NULL END)), 0) * 25.0), 2.375), 0)))/6 AS pass_rating,
    SUM(CASE WHEN true THEN rush_was_attempt  ELSE NULL END) AS rush_attempts_sum,
    SUM(CASE WHEN true THEN rush_yards ELSE NULL END) AS rush_yards_sum,
    SUM(CASE WHEN true THEN rush_yards ELSE NULL END) / SUM(CASE WHEN true THEN rush_was_attempt  ELSE NULL END) AS rush_yards_per_attempt,
    SUM(CASE WHEN true THEN rush_was_touchdown ELSE NULL END) AS rush_touchdowns_sum,
  FROM
    `nfl-table.main.prod`
  GROUP BY 1, 2, 3
)
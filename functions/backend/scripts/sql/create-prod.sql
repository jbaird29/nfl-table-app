CREATE OR REPLACE TABLE
  `nfl-table.main.prod`
PARTITION BY
  RANGE_BUCKET(season_year, GENERATE_ARRAY(2012, 2021, 1))
CLUSTER BY
  stat_type, player_name_with_position, team_name
AS (
  SELECT
    stats.game_periods_pbp_events_id || '--' || stats.stat_type AS stat_id,
    CASE WHEN stats.stat_type = 'receive' THEN 'recv' ELSE stats.stat_type END AS stat_type,
    games.summary_season_year AS season_year,
    games.summary_week_title AS season_week,
    games.summary_venue_name AS venue_name,
    stats.player_id AS player_id,
    latest_rosters.full_name AS player_name,
    latest_rosters.position AS player_position,
    latest_rosters.full_name || ' (' || latest_rosters.position || ')' AS player_name_with_position,
    latest_rosters.gsis_id AS player_gsis_id,
    CASE WHEN stats.team_name = 'Redskins' THEN 'Football Team' ELSE stats.team_name END AS team_name,
    latest_rosters.team AS team_abbreviation,
    stats.team_id AS team_id,
    stats.inside_20 AS inside_20,
    stats.goaltogo AS goaltogo,
    stats.nullified AS nullified,
    stats.firstdown AS firstdown,
    CASE WHEN stats.stat_type = "pass"    THEN stats.yards ELSE NULL END AS pass_yards,
    CASE WHEN stats.stat_type = "pass"    THEN stats.att_yards ELSE NULL END AS pass_attempt_yards,
    CASE WHEN stats.stat_type = "pass" AND stats.complete = 1 THEN stats.att_yards ELSE NULL END AS pass_air_yards,
    CASE WHEN stats.stat_type = "pass"    THEN stats.pocket_time ELSE NULL END AS pass_pocket_time,
    CASE WHEN stats.stat_type = "pass"    THEN stats.sack_yards ELSE NULL END AS pass_sack_yards,
    CASE WHEN stats.stat_type = "pass"    THEN stats.attempt ELSE NULL END AS pass_was_attempt,
    CASE WHEN stats.stat_type = "pass"    THEN stats.complete ELSE NULL END AS pass_was_completion,
    CASE WHEN stats.stat_type = "pass"    THEN stats.touchdown ELSE NULL END AS pass_was_touchdown,
    CASE WHEN stats.stat_type = "pass"    THEN stats.interception ELSE NULL END AS pass_was_interception,
    CASE WHEN stats.stat_type = "pass"    THEN stats.blitz ELSE NULL END AS pass_was_blitzed,
    CASE WHEN stats.stat_type = "pass"    THEN stats.batted_pass ELSE NULL END AS pass_was_batted,
    CASE WHEN stats.stat_type = "pass"    THEN stats.on_target_throw ELSE NULL END AS pass_was_on_target,
    CASE WHEN stats.stat_type = "pass"    THEN stats.hurry ELSE NULL END AS pass_was_hurry,
    CASE WHEN stats.stat_type = "pass"    THEN stats.knockdown ELSE NULL END AS pass_was_knockdown,
    CASE WHEN stats.stat_type = "pass"    THEN stats.sack ELSE NULL END AS pass_was_sack,
    CASE WHEN stats.stat_type = "pass"    THEN stats.incompletion_type ELSE NULL END AS pass_incompletion_type,
    CASE WHEN (CASE WHEN stats.stat_type = "pass"    THEN stats.incompletion_type ELSE NULL END) = "Poorly Thrown" THEN 1 ELSE 0 END AS pass_incompletion_was_poor_throw,
    CASE WHEN (CASE WHEN stats.stat_type = "pass"    THEN stats.incompletion_type ELSE NULL END) = "Thrown Away" THEN 1 ELSE 0 END AS pass_incompletion_was_throwaway,
    CASE WHEN (CASE WHEN stats.stat_type = "pass"    THEN stats.incompletion_type ELSE NULL END) = "Dropped Pass" THEN 1 ELSE 0 END AS pass_incompletion_was_dropped,
    CASE WHEN (CASE WHEN stats.stat_type = "pass"    THEN stats.incompletion_type ELSE NULL END) = "Pass Defended" THEN 1 ELSE 0 END AS pass_incompletion_was_defended,
    CASE WHEN (CASE WHEN stats.stat_type = "pass"    THEN stats.incompletion_type ELSE NULL END) = "Spike" THEN 1 ELSE 0 END AS pass_incompletion_was_spike,
    CASE WHEN stats.stat_type = "rush"    THEN stats.yards ELSE NULL END AS rush_yards,
    CASE WHEN stats.stat_type = "rush"    THEN stats.attempt ELSE NULL END AS rush_was_attempt,
    CASE WHEN stats.stat_type = "rush"    THEN stats.touchdown ELSE NULL END AS rush_was_touchdown,
    CASE WHEN stats.stat_type = "rush"    THEN stats.broken_tackles ELSE NULL END AS rush_broken_tackles,
    CASE WHEN stats.stat_type = "rush"    THEN stats.yards_after_contact ELSE NULL END AS yards_after_contact,
    CASE WHEN stats.stat_type = "rush"    THEN stats.scramble ELSE NULL END AS rush_was_scramble,
    CASE WHEN stats.stat_type = "receive" THEN stats.yards ELSE NULL END AS recv_yards,
    CASE WHEN stats.stat_type = "receive" THEN stats.reception ELSE NULL END AS recv_was_reception,
    CASE WHEN stats.stat_type = "receive" THEN stats.target ELSE NULL END AS recv_was_target,
    CASE WHEN stats.stat_type = "receive" THEN stats.touchdown ELSE NULL END AS recv_was_touchdown,
  FROM
    `nfl-table.main.statistics` AS stats
  JOIN
    `nfl-table.main.games` AS games
  ON
    stats.game_id = games.id
  JOIN
    `nfl-table.main.latest_rosters` AS latest_rosters
  ON
    stats.player_id = latest_rosters.sportradar_id
)
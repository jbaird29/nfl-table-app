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
    player_info.full_name AS player_name,
    player_info.player_position AS player_position,
    player_info.full_name || ' (' || player_info.player_position || ')' AS player_name_with_position,
    player_info.player_gsis_id AS player_gsis_id,
    CASE WHEN stats.team_name = 'Redskins' THEN 'Football Team' ELSE stats.team_name END AS team_name,
    player_info.team_abbreviation AS team_abbreviation,
    CASE WHEN stats.team_id = '9dbb9060-ba0f-4920-829e-16d4d9246b5d' THEN '1f6dcffb-9823-43cd-9ff4-e7a8466749b5' WHEN stats.team_id = '1c1cec48-6352-4556-b789-35304c1a6ae1' THEN '7d4fcc64-9cb5-4d1b-8e75-8a906d1e1576' WHEN stats.team_id = '39f349de-6463-4803-ad70-f1e0f144f5ed' THEN '2eff2a03-54d4-46ba-890e-2bc3925548f3' ELSE stats.team_id END AS team_id,
    stats.inside_20 AS inside_20,
    stats.goaltogo AS goaltogo,
    stats.nullified AS nullified,
    CASE WHEN stats.stat_type = "pass"    THEN stats.yards ELSE NULL END AS pass_yards,
    CASE WHEN stats.stat_type = "pass"    THEN stats.att_yards ELSE NULL END AS pass_attempt_air_yards,
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
    CASE WHEN stats.stat_type = "rush"    THEN stats.yards_after_contact ELSE NULL END AS rush_yards_after_contact,
    CASE WHEN stats.stat_type = "rush"    THEN stats.scramble ELSE NULL END AS rush_was_scramble,
    CASE WHEN stats.stat_type = "rush"    THEN stats.tlost ELSE NULL END AS rush_was_tackle_for_loss,
    CASE WHEN stats.stat_type = "rush"    THEN stats.tlost_yards ELSE NULL END AS rush_tackle_for_loss_yards,
    CASE WHEN stats.stat_type = "rush"    THEN stats.firstdown ELSE NULL END AS rush_was_firstdown,
    CASE WHEN stats.stat_type = "receive" THEN stats.yards ELSE NULL END AS recv_yards,
    CASE WHEN stats.stat_type = "receive" THEN stats.reception ELSE NULL END AS recv_was_reception,
    CASE WHEN stats.stat_type = "receive" THEN stats.target ELSE NULL END AS recv_was_target,
    CASE WHEN stats.stat_type = "receive" THEN stats.catchable ELSE NULL END AS recv_was_catchable,
    CASE WHEN stats.stat_type = "receive" THEN stats.touchdown ELSE NULL END AS recv_was_touchdown,
    CASE WHEN stats.stat_type = "receive"    THEN stats.yards_after_contact ELSE NULL END AS recv_yards_after_contact,
    CASE WHEN stats.stat_type = "receive"    THEN stats.yards_after_catch ELSE NULL END AS recv_yards_after_catch,
    CASE WHEN stats.stat_type = "receive" THEN stats.broken_tackles ELSE NULL END AS recv_broken_tackles,
    CASE WHEN stats.stat_type = "receive" THEN stats.dropped ELSE NULL END AS recv_was_dropped,
  FROM
    `nfl-table.main.statistics` AS stats
  JOIN
    `nfl-table.main.games` AS games
  ON
    stats.game_id = games.id
  JOIN
    `nfl-table.main.player_info` AS player_info
  ON
    stats.player_id = player_info.sportradar_id
)
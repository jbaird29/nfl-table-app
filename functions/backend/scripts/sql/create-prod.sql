CREATE OR REPLACE TABLE
  `nfl-table.main.prod`
PARTITION BY
  RANGE_BUCKET(season_year, GENERATE_ARRAY(2012, 2021, 1))
CLUSTER BY
  stat_type, player_name, player_position, team_name
AS (
  SELECT
    s.game_periods_pbp_events_id || '--' || s.stat_type AS stat_id,
    CASE WHEN s.stat_type = 'receive' THEN 'recv' ELSE s.stat_type END AS stat_type,
    s.player_name AS player_name,
    SPLIT(s.player_position, '/')[SAFE_OFFSET(0)] AS unclean_position,
    CASE WHEN SPLIT(s.player_position, '/')[SAFE_OFFSET(0)] = 'HB' THEN 'RB' ELSE SPLIT(s.player_position, '/')[SAFE_OFFSET(0)] END AS player_position,
    player_name || ' (' || player_position || ')' AS player_name_with_position,
    CASE WHEN s.team_name = 'Redskins' THEN 'Football Team' ELSE s.team_name END AS team_name,
    g.summary_season_year AS season_year,
    g.summary_week_title AS season_week,
    g.summary_venue_name AS venue_name,
    s.inside_20 AS inside_20,
    s.goaltogo AS goaltogo,
    s.nullified AS nullified,
    s.firstdown AS firstdown,
    CASE WHEN s.stat_type = "pass"    THEN s.yards ELSE NULL END AS pass_yards,
    CASE WHEN s.stat_type = "pass"    THEN s.att_yards ELSE NULL END AS pass_attempt_yards,
    CASE WHEN s.stat_type = "pass" AND s.complete = 1 THEN s.att_yards ELSE NULL END AS pass_air_yards,
    CASE WHEN s.stat_type = "pass"    THEN s.pocket_time ELSE NULL END AS pass_pocket_time,
    CASE WHEN s.stat_type = "pass"    THEN s.sack_yards ELSE NULL END AS pass_sack_yards,
    CASE WHEN s.stat_type = "pass"    THEN s.attempt ELSE NULL END AS pass_was_attempt,
    CASE WHEN s.stat_type = "pass"    THEN s.complete ELSE NULL END AS pass_was_completion,
    CASE WHEN s.stat_type = "pass"    THEN s.touchdown ELSE NULL END AS pass_was_touchdown,
    CASE WHEN s.stat_type = "pass"    THEN s.interception ELSE NULL END AS pass_was_interception,
    CASE WHEN s.stat_type = "pass"    THEN s.blitz ELSE NULL END AS pass_was_blitzed,
    CASE WHEN s.stat_type = "pass"    THEN s.batted_pass ELSE NULL END AS pass_was_batted,
    CASE WHEN s.stat_type = "pass"    THEN s.on_target_throw ELSE NULL END AS pass_was_on_target,
    CASE WHEN s.stat_type = "pass"    THEN s.hurry ELSE NULL END AS pass_was_hurry,
    CASE WHEN s.stat_type = "pass"    THEN s.knockdown ELSE NULL END AS pass_was_knockdown,
    CASE WHEN s.stat_type = "pass"    THEN s.sack ELSE NULL END AS pass_was_sack,
    CASE WHEN s.stat_type = "pass"    THEN s.incompletion_type ELSE NULL END AS pass_incompletion_type,
    CASE WHEN (CASE WHEN s.stat_type = "pass"    THEN s.incompletion_type ELSE NULL END) = "Poorly Thrown" THEN 1 ELSE 0 END AS pass_incompletion_was_poor_throw,
    CASE WHEN (CASE WHEN s.stat_type = "pass"    THEN s.incompletion_type ELSE NULL END) = "Thrown Away" THEN 1 ELSE 0 END AS pass_incompletion_was_throwaway,
    CASE WHEN (CASE WHEN s.stat_type = "pass"    THEN s.incompletion_type ELSE NULL END) = "Dropped Pass" THEN 1 ELSE 0 END AS pass_incompletion_was_dropped,
    CASE WHEN (CASE WHEN s.stat_type = "pass"    THEN s.incompletion_type ELSE NULL END) = "Pass Defended" THEN 1 ELSE 0 END AS pass_incompletion_was_defended,
    CASE WHEN (CASE WHEN s.stat_type = "pass"    THEN s.incompletion_type ELSE NULL END) = "Spike" THEN 1 ELSE 0 END AS pass_incompletion_was_spike,
    CASE WHEN s.stat_type = "rush"    THEN s.yards ELSE NULL END AS rush_yards,
    CASE WHEN s.stat_type = "rush"    THEN s.attempt ELSE NULL END AS rush_was_attempt,
    CASE WHEN s.stat_type = "rush"    THEN s.touchdown ELSE NULL END AS rush_was_touchdown,
    CASE WHEN s.stat_type = "rush"    THEN s.broken_tackles ELSE NULL END AS rush_broken_tackles,
    CASE WHEN s.stat_type = "rush"    THEN s.yards_after_contact ELSE NULL END AS yards_after_contact,
    CASE WHEN s.stat_type = "rush"    THEN s.scramble ELSE NULL END AS rush_was_scramble,
    CASE WHEN s.stat_type = "receive" THEN s.yards ELSE NULL END AS recv_yards,
    CASE WHEN s.stat_type = "receive" THEN s.reception ELSE NULL END AS recv_was_reception,
    CASE WHEN s.stat_type = "receive" THEN s.target ELSE NULL END AS recv_was_target,
    CASE WHEN s.stat_type = "receive" THEN s.touchdown ELSE NULL END AS recv_was_touchdown,
  FROM
    `nfl-table.main.statistics` AS s
  JOIN
    `nfl-table.main.games` AS g
  ON
    s.game_id = g.id
)
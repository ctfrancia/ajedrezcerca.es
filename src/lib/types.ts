export interface TournamentSchedule {
  day_of_week: number // 0 = Sunday, 1 = Monday, etc.
  start_time: string // Time in HH:MM format (e.g., "09:00")
  end_time: string // Time in HH:MM format (e.g., "17:00")
}

export interface Tournament {
  id: number
  name: string
  description: string
  poster: string
  schedules: TournamentSchedule[] // Array of recurring schedules
  tournament_start_date: string // When the tournament series begins
  tournament_end_date: string // When the tournament series ends (optional)
  location: string
  state: 'open' | 'closed' | 'completed'
  prize_pool: number
  winner_id: number | null
  creator_id: number
  player_count: number
  player_count_limit: number
  player_count_limit_enabled: boolean
  available_slots: number
  registration_start_time: string
  registration_end_time: string
  enable_registration: boolean
  enable_ranking: boolean
  ranking_type: 'elo' | 'glicko'
  created_at: string
  updated_at: string
}

export interface TournamentResponse {
  tournaments: Tournament[]
}
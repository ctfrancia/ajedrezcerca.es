export interface TournamentSchedule {
  day_of_week: number // 0 = Sunday, 1 = Monday, etc.
  start_time: string // Time in HH:MM format (e.g., "09:00")
  end_time: string // Time in HH:MM format (e.g., "17:00")
}

export interface Player {
  id: number
  name: string
  email: string
  rating?: number
  registration_date: string
  avatar?: string
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
  registered_players?: Player[] // List of registered players
  rules?: string // Tournament rules
  contact_info?: string // Contact information
  entry_fee?: number // Entry fee in addition to prize pool
}

export interface TournamentResponse {
  tournaments: Tournament[]
}
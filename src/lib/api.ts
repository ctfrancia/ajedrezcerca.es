import type { Tournament, TournamentResponse } from './types.js'

// Mock API URL - update this with your real API endpoint
const API_BASE_URL = 'https://api.maple.es'

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message)
        this.name = 'ApiError'
    }
}

export async function fetchTournaments(): Promise<Tournament[]> {
    try {
        // For now, simulate API call with mock data and delay
        console.log('Fetching tournaments from API...')

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock API response - this will be replaced with real API call
        const mockResponse: TournamentResponse = {
            tournaments: [
                {
                    id: 1,
                    name: "Sunday Morning Chess Club",
                    description: "Weekly chess tournament every Sunday morning",
                    poster: "https://example.com/poster.png",
                    schedules: [
                        { day_of_week: 0, start_time: "09:00", end_time: "13:00" }
                    ],
                    tournament_start_date: "2025-08-01T00:00:00Z",
                    tournament_end_date: "2025-12-31T00:00:00Z",
                    location: "Carrer d'Alexandre Galí, 24, Sant Andreu, 08027 Barcelona",
                    state: "open",
                    prize_pool: 100,
                    winner_id: null,
                    creator_id: 1,
                    player_count: 15,
                    player_count_limit: 32,
                    player_count_limit_enabled: true,
                    available_slots: 17,
                    registration_start_time: "2025-08-01T00:00:00Z",
                    registration_end_time: "2025-12-30T23:59:59Z",
                    enable_registration: true,
                    enable_ranking: true,
                    ranking_type: "glicko",
                    created_at: "2025-08-01T00:00:00Z",
                    updated_at: "2025-08-01T00:00:00Z",
                    registered_players: [
                        {
                            id: 1,
                            name: "María García",
                            email: "maria.garcia@email.com",
                            rating: 1650,
                            registration_date: "2025-08-02T10:30:00Z"
                        },
                        {
                            id: 2,
                            name: "Carlos Ruiz",
                            email: "carlos.ruiz@email.com",
                            rating: 1420,
                            registration_date: "2025-08-03T14:15:00Z"
                        },
                        {
                            id: 3,
                            name: "Ana López",
                            email: "ana.lopez@email.com",
                            rating: 1580,
                            registration_date: "2025-08-04T09:45:00Z"
                        }
                    ],
                    rules: "Swiss system tournament. FIDE rules apply. 90 minutes + 30 seconds increment per move.",
                    contact_info: "Tournament Director: Juan Martínez - juan@ajedrezcerca.es - +34 123 456 789",
                    entry_fee: 15
                },
                {
                    id: 2,
                    name: "Midweek Chess Challenge",
                    description: "Tuesday and Wednesday evening tournaments",
                    poster: "https://example.com/poster.png",
                    schedules: [
                        { day_of_week: 2, start_time: "19:00", end_time: "22:00" },
                        { day_of_week: 3, start_time: "19:30", end_time: "22:30" }
                    ],
                    tournament_start_date: "2025-08-05T00:00:00Z",
                    tournament_end_date: "2025-11-30T00:00:00Z",
                    location: "Plaça de Catalunya, 1, Barcelona",
                    state: "open",
                    prize_pool: 200,
                    winner_id: null,
                    creator_id: 2,
                    player_count: 8,
                    player_count_limit: 16,
                    player_count_limit_enabled: true,
                    available_slots: 8,
                    registration_start_time: "2025-08-01T00:00:00Z",
                    registration_end_time: "2025-11-29T23:59:59Z",
                    enable_registration: true,
                    enable_ranking: true,
                    ranking_type: "elo",
                    created_at: "2025-08-01T00:00:00Z",
                    updated_at: "2025-08-01T00:00:00Z",
                    registered_players: [
                        {
                            id: 4,
                            name: "David Fernández",
                            email: "david.fernandez@email.com",
                            rating: 1750,
                            registration_date: "2025-08-06T16:20:00Z"
                        },
                        {
                            id: 5,
                            name: "Laura Sánchez",
                            email: "laura.sanchez@email.com",
                            rating: 1390,
                            registration_date: "2025-08-07T11:10:00Z"
                        }
                    ],
                    rules: "Rapid chess format. 15 minutes + 10 seconds increment. Round-robin format.",
                    contact_info: "organizer@playadechess.com - +34 987 654 321",
                    entry_fee: 10
                },
                {
                    id: 3,
                    name: "Weekend Warriors",
                    description: "Alternating schedule - Monday/Friday one week, then Saturday next week",
                    poster: "https://example.com/poster.png",
                    schedules: [
                        { day_of_week: 1, start_time: "18:00", end_time: "21:00" },
                        { day_of_week: 5, start_time: "18:30", end_time: "21:30" },
                        { day_of_week: 6, start_time: "14:00", end_time: "17:00" }
                    ],
                    tournament_start_date: "2025-08-10T00:00:00Z",
                    tournament_end_date: "2025-10-31T00:00:00Z",
                    location: "Parc de la Ciutadella, Barcelona",
                    state: "closed",
                    prize_pool: 150,
                    winner_id: null,
                    creator_id: 3,
                    player_count: 12,
                    player_count_limit: 24,
                    player_count_limit_enabled: true,
                    available_slots: 12,
                    registration_start_time: "2025-08-01T00:00:00Z",
                    registration_end_time: "2025-10-30T23:59:59Z",
                    enable_registration: true,
                    enable_ranking: true,
                    ranking_type: "elo",
                    created_at: "2025-08-01T00:00:00Z",
                    updated_at: "2025-08-01T00:00:00Z"
                }
            ]
        }

        return mockResponse.tournaments

        // TODO: Replace with real API call when backend is ready
        /*
        const response = await fetch(`${API_BASE_URL}/tournaments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
        }
        
        const data: TournamentResponse = await response.json()
        return data.tournaments
        */

    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }

        console.error('Failed to fetch tournaments:', error)
        throw new ApiError(0, 'Failed to fetch tournaments. Please check your connection and try again.')
    }
}

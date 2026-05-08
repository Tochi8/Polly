export interface User {
  id: string
  username: string
  provider: string
  role: string
}

export interface Poll {
  id: string
  title: string
  status: string
  voting_closes_at: string
  created_by: string
  registeredCount: number
  votesCount: number
}
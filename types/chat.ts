export type ChatResponse = {
  ok: boolean
  mode: string
  answer: string
  structured: {
    kurzfazit: string
    gdl: string
    evg: string
    unterschiede: string[]
    gemeinsamkeiten: string[]
  }
  sources: any[]
  sourcesByUnion: {
    GDL: any[]
    EVG: any[]
  }
}
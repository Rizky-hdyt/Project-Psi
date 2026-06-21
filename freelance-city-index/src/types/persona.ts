export type PersonaId =
  | "tech-professional"
  | "creative-professional"
  | "student-fresh-graduate"
  | "digital-nomad";

export interface Persona {
  id: PersonaId;
  nama: string;
  deskripsi: string;
}

export type SphereId = string;

export type Sphere = {
  id: SphereId;
  name: string;
  description?: string;
  memberCount: number;
  coverUrl?: string;
};

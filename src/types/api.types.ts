export type User = {
   id: number;
   email: string;
   username: string;
   isPremium: boolean;
   avatar?: string | null;
   isEmailVerified: boolean;
   createdAt: Date;
   updatedAt: Date;
   hashes: number;
   sessions?: {
      current?: ActiveSession;
      sessions: ActiveSession[];
   };
};

export type ActiveSession = {
   metadata: SessionMetadata;
   createdAt: Date;
};

export type LocationData = {
   country?: string;
   city?: string;
   latitude?: number;
   longitude?: number;
};

export type DeviceData = {
   client?: string;
   os?: string;
   device?: string;
};

export type SessionMetadata = {
   location: LocationData;
   device: DeviceData;
   ip: string;
};

export type Data = {
   id: string;
   content?: string;
   ttl: number;
   title?: string;
   description?: string;
   createdAt: Date;
   updatedAt: Date;
   isPublic?: boolean;
   isOwnerHidden?: boolean;
   owner?: {
      id: number;
      username: string;
      isPremium: boolean;
   };
};

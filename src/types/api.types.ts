export type User = {
   id: number;
   email: string;
   username: string;
   avatar?: string | null;
   isEmailVerified: boolean;
   createdAt: Date;
   updatedAt: Date;
};

export type PublicUser = {
   id: number;
   username: string;
   avatar?: string | null;
};

export type Sessions = {
   current?: ActiveSession;
   sessions: ActiveSession[];
};

export type ActiveSession = {
   sid: string;
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
   isYours: boolean;
   owner?: {
      id: number;
      username: string;
      isPremium: boolean;
   };
};

export type ReducedData = Omit<Data, 'content' | 'owner'>;

export type PostsResponse = {
   hasMore: boolean;
   data: ReducedData[];
};

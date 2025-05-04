export const EXPIRATION_OPTIONS = [
   {
      value: -1,
      title: 'Never'
   },
   {
      value: 30,
      title: '30 seconds'
   },
   {
      value: 60,
      title: '1 minute'
   },
   {
      value: 5 * 60,
      title: '5 minutes'
   },
   {
      value: 10 * 60,
      title: '10 minutes'
   },
   {
      value: 30 * 60,
      title: '30 minutes'
   },
   {
      value: 3600,
      title: '1 hour'
   },
   {
      value: 2 * 3600,
      title: '2 hours'
   },
   {
      value: 5 * 3600,
      title: '5 hours'
   },
   {
      value: 10 * 3600,
      title: '10 hours'
   },
   {
      value: 24 * 3600,
      title: '1 day'
   },
   {
      value: 3 * 24 * 3600,
      title: '3 days'
   },
   {
      value: 7 * 24 * 3600,
      title: '1 week'
   },
   {
      value: 30 * 24 * 3600,
      title: '1 month'
   },
   {
      value: 6 * 30 * 24 * 3600,
      title: '6 months'
   },
   {
      value: 12 * 30 * 24 * 3600,
      title: '1 year'
   }
];

export const QUERY_KEYS = {
   USER: 'user',
   DATA: 'data',
   SESSIONS: 'sessions',
   POSTS: 'posts'
};

export const MAX_GUEST_EXPIRATION = 24 * 3600;

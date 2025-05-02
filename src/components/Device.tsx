import { Microwave, Monitor, Smartphone, TabletSmartphone } from 'lucide-react';
import { FC, useMemo } from 'react';

interface DeviceProps {
   device?: string;
}

const Device: FC<DeviceProps> = ({ device }) => {
   const icon = useMemo(() => {
      if (device === 'desktop') {
         return { element: <Monitor />, color: 'bg-gradient-to-r from-fuchsia-600 to-pink-600' };
      }
      if (device === 'smartphone') {
         return { element: <Smartphone />, color: 'bg-gradient-to-r from-emerald-500 to-emerald-900' };
      }
      if (device === 'tablet') {
         return { element: <TabletSmartphone />, color: 'bg-gradient-to-br from-cyan-400 to-lime-300' };
      }
      return { element: <Microwave />, color: 'bg-gradient-to-r from-slate-300 to-slate-500' };
   }, [device]);
   return (
      <div className={`rounded-full w-12 h-12 flex items-center justify-center text-white ${icon.color}`}>
         {icon.element}
      </div>
   );
};

export default Device;

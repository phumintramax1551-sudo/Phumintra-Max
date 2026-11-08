import React from 'react';

export const SniperScope: React.FC = () => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none flex items-center justify-center overflow-hidden">
      {/* Outer Black Mask with Circular Reticle Cutout */}
      <div className="absolute inset-0 bg-black/90 [mask-image:radial-gradient(circle_at_center,transparent_38%,black_40%)]"></div>

      {/* Scope Border Ring */}
      <div className="relative w-[76vmin] h-[76vmin] rounded-full border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)_inset] flex items-center justify-center">
        {/* Reticle Lines */}
        <div className="absolute w-full h-[1px] bg-cyan-400/60"></div>
        <div className="absolute h-full w-[1px] bg-cyan-400/60"></div>

        {/* Center Red Dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>

        {/* Rangefinder Ticks */}
        <div className="absolute flex flex-col items-center gap-4 text-[9px] font-mono text-cyan-400/70">
          <div className="w-4 h-[1px] bg-cyan-400/70"></div>
          <div className="w-6 h-[1px] bg-cyan-400/70"></div>
          <div className="w-8 h-[1px] bg-cyan-400/70"></div>
          <span className="text-[10px] font-bold">100M</span>
          <div className="w-10 h-[1px] bg-cyan-400/70"></div>
          <span className="text-[10px] font-bold">200M</span>
        </div>

        {/* Scope Telemetry Badges */}
        <div className="absolute top-8 left-12 text-[10px] font-mono text-cyan-400/80">
          <div>MAGNIFICATION: 4.5X</div>
          <div>BALLISTIC: .338 MAG</div>
        </div>

        <div className="absolute top-8 right-12 text-[10px] font-mono text-cyan-400/80 text-right">
          <div>ELEVATION: +0.24 MIL</div>
          <div>WINDAGE: 0.00 MIL</div>
        </div>

        <div className="absolute bottom-10 text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase">
          [ AWP VALKYRIE · TARGET LOCKED ]
        </div>
      </div>
    </div>
  );
};

import { ComparisonRow } from '../types/physics';

export const mechanicalVsEmData: ComparisonRow[] = [
  {
    aspect: '1. Definition',
    itemA: 'A wave that transfers energy through particle vibration of matter.',
    itemB: 'A wave composed of synchronized oscillating electric and magnetic fields.',
    highlight: true,
  },
  {
    aspect: '2. Medium Requirement',
    itemA: 'Needs a material medium (solid, liquid, or gas). Cannot travel in a vacuum.',
    itemB: 'Does NOT need a medium; can travel freely through empty vacuum as well as transparent matter.',
    highlight: true,
  },
  {
    aspect: '3. Wave Motion Type',
    itemA: 'Can be transverse (e.g., guitar string, S-waves) or longitudinal (e.g., sound in air, P-waves).',
    itemB: 'Always transverse (electric & magnetic fields oscillate at 90° to propagation direction).',
  },
  {
    aspect: '4. Speed of Propagation',
    itemA: 'Depends heavily on the medium: ~343 m/s in air, ~1,500 m/s in water, ~5,000 m/s in steel.',
    itemB: 'Travels at the universal speed of light in vacuum: c = 3.0 × 10⁸ m/s (slower in glass/water).',
    highlight: true,
  },
  {
    aspect: '5. Examples',
    itemA: 'Sound waves, ocean water waves, seismic earthquake waves, slinky spring vibrations.',
    itemB: 'Visible light, radio waves, Wi-Fi, microwaves, infrared, ultraviolet, X-rays, gamma rays.',
  },
  {
    aspect: '6. Physical Source',
    itemA: 'Produced by vibrating matter (tuning fork, vocal cords, drum skin, tectonic plates).',
    itemB: 'Produced by accelerating electric charges or transitions in atomic electron energy levels.',
  },
  {
    aspect: '7. Common Uses',
    itemA: 'Human acoustic speech, musical instruments, ultrasound scans, seismology geology study.',
    itemB: 'Wireless global communication, human vision, medical X-ray radiography, radar astronomy.',
  },
];

export const amplitudeVsWavelengthData: ComparisonRow[] = [
  {
    aspect: '1. Definition',
    itemA: 'The maximum displacement of a particle from its undisturbed equilibrium (mean) position.',
    itemB: 'The spatial length between two consecutive identical points in phase (e.g., crest to crest).',
    highlight: true,
  },
  {
    aspect: '2. Standard Symbol',
    itemA: 'A',
    itemB: 'λ (Greek letter Lambda)',
  },
  {
    aspect: '3. Measured As',
    itemA: 'Vertical distance from the center baseline (mean position) to the peak crest or trough.',
    itemB: 'Horizontal distance from crest to next crest, or trough to next trough.',
    highlight: true,
  },
  {
    aspect: '4. SI Metric Unit',
    itemA: 'Metre (m)',
    itemB: 'Metre (m)',
  },
  {
    aspect: '5. Physical Relation',
    itemA: 'Directly related to wave energy, acoustic loudness, and light intensity (Energy ∝ A²).',
    itemB: 'Inversely related to frequency for constant speed through the wave equation: v = f × λ.',
    highlight: true,
  },
  {
    aspect: '6. Visual Rule',
    itemA: 'A "taller" or deeper wave has a greater amplitude.',
    itemB: 'A "wider" or more stretched wave has a greater wavelength.',
  },
  {
    aspect: '7. Occurrence',
    itemA: 'Seen in both stationary oscillations (pendulums) and traveling waves.',
    itemB: 'Seen in progressive and standing waves only (requires spatial propagation).',
  },
];

export const waveTypesInfo = [
  {
    id: 'transverse',
    title: 'Transverse Wave',
    subtitle: 'Particles move perpendicular to wave travel',
    motion: 'Particles oscillate UP & DOWN while the wave energy travels FORWARD',
    keyFeatures: ['Crest (highest displacement)', 'Trough (lowest displacement)', 'Amplitude measured vertically'],
    examples: ['Light and all EM waves', 'Plucked guitar string', 'Stadium crowd wave', 'Seismic S-waves'],
    accentColor: 'sky',
  },
  {
    id: 'longitudinal',
    title: 'Longitudinal Wave',
    subtitle: 'Particles move parallel to wave travel',
    motion: 'Particles vibrate BACK & FORTH in the same direction the wave travels',
    keyFeatures: ['Compression (regions of high density & pressure)', 'Rarefaction (regions of low density & pressure)', 'Wavelength is compression-to-compression'],
    examples: ['Sound waves in air', 'Compressed slinky spring', 'Ultrasound in tissue', 'Seismic P-waves (primary)'],
    accentColor: 'indigo',
  },
  {
    id: 'surface',
    title: 'Surface Wave',
    subtitle: 'Combined transverse & longitudinal motion',
    motion: 'Particles execute circular or elliptical orbital paths at fluid boundaries',
    keyFeatures: ['Orbital motion shrinks exponentially with depth', 'Produces ocean swell & breakers', 'Complex fluid interface mechanics'],
    examples: ['Deep ocean ripples & surface waves', 'Rayleigh waves during earthquakes', 'Pond water ripples'],
    accentColor: 'teal',
  },
];

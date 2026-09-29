export interface Question {
  id: string;
  category: 'types' | 'mechanical_vs_em' | 'parameters' | 'calculations' | 'real_world';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  formula?: string;
  diagramType?: 'transverse' | 'longitudinal' | 'surface' | 'amplitude_wavelength' | 'vacuum';
}

export interface WaveParameters {
  amplitude: number; // in meters (0.2 to 3.0)
  wavelength: number; // in meters (1.0 to 10.0)
  frequency: number; // in Hz (0.2 to 5.0)
  speed: number; // v = f * lambda
  damping: number; // 0 to 1
  isPlaying: boolean;
}

export interface ComparisonRow {
  aspect: string;
  itemA: string;
  itemB: string;
  highlight?: boolean;
}

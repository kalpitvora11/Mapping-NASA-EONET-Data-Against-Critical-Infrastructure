type Gmp3DMapAttributes = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement> & {
    center?: string;
    tilt?: string;
    heading?: string;
    range?: string;
    'map-id'?: string;
    'default-labels-disabled'?: string;
  },
  HTMLElement
>;

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-map-3d': Gmp3DMapAttributes;
    }
  }
}

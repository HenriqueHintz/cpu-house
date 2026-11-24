import {
  Box,
  Cloud,
  Link,
  Lock,
  NodeCube,
  Platform,
  Rack,
  SceneDefs,
  Shield,
} from '@/components/iso/iso';

export type IllustrationKind = 'seguranca' | 'backup' | 'ecidade';

export function IsoIllustration({
  kind,
  animated = true,
}: {
  kind: IllustrationKind;
  animated?: boolean;
}) {
  return (
    <svg
      viewBox="-260 -250 520 500"
      className="h-auto w-full"
      aria-hidden="true"
      focusable="false"
    >
      <SceneDefs />
      <Platform />
      {kind === 'seguranca' && (
        <>
          <Link from={[-100, -60]} to={[0, -60]} animated={animated} delay={0} bend={-20} />
          <Link from={[0, -60]} to={[120, -60]} animated={animated} delay={0.6} bend={-20} />
          <NodeCube x={-110} y={30} />
          <NodeCube x={-60} y={60} />
          <Link from={[-100, 30]} to={[10, -40]} animated={animated} delay={0.3} bend={20} />
          <Link from={[-50, 60]} to={[10, -40]} animated={animated} delay={0.9} bend={20} />
          <Rack x={-35} y={-30} z={12} animated={animated} />
          <Shield x={130} y={-60} scale={1.2} />
        </>
      )}
      {kind === 'backup' && (
        <>
          <Link from={[-10, -60]} to={[-10, -150]} animated={animated} delay={0.2} bend={0} />
          <Link from={[35, -30]} to={[105, 40]} animated={animated} delay={0.8} bend={25} />
          <Rack x={-70} y={-20} z={12} animated={animated} />
          <Rack x={0} y={-20} z={12} animated={animated} />
          <Cloud x={0} y={-180} scale={1.5} />
          <Lock x={110} y={40} />
        </>
      )}
      {kind === 'ecidade' && (
        <>
          <Box x={-90} y={-60} z={12} w={60} d={50} h={110} />
          <Box x={-10} y={-70} z={12} w={70} d={60} h={160} />
          <Box x={60} y={-30} z={12} w={50} d={50} h={80} />
          <Link from={[-60, -40]} to={[10, -90]} animated={animated} delay={0.1} bend={-30} />
          <Link from={[10, -90]} to={[100, -20]} animated={animated} delay={0.7} bend={-30} />
          <NodeCube x={-120} y={50} />
          <NodeCube x={120} y={60} />
        </>
      )}
    </svg>
  );
}

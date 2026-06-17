import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NEXUS — Premium Tech Store',
  description:
    'NEXUS — Premium tech products with cutting-edge design. Shop the finest electronics, audio, and accessories.',
}

export default function NexusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

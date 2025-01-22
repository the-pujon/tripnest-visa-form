import React from 'react'

const Title = ({ children }: { children: React.ReactNode }) => {
  return (
    <h2 className="text-lg font-bold text-primary">{children}</h2>
  )
}

export { Title }
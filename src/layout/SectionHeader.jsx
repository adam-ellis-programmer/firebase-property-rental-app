import React from 'react'

const SectionHeader = ({text}) => {
  return (
    <div>
      <section className="section-header">
        <h3>{text}</h3>
      </section>
    </div>
  )
}

export default SectionHeader

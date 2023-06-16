"use client"

import { useState } from 'react'

import css from "@styles/creation.module.scss"

import Header from "@components/creation/Header"
import TypePanel from "@components/creation/TypePanel"
import CreatePanel from "@components/creation/CreatePanel"
import PreviewPanel from "@components/creation/PreviewPanel"


const FormCreation = () => {

  let [panel, setPanel] = useState(1)

  const togglePanel = (index: number) => {
    //! guard clause daca este la panel 1 si vrea sa treaca la panel 2, sa aiba neaparat form-ul completat
    setPanel(index)
  }

  const renderPanel = (): JSX.Element | null => {
    switch (panel) {
      case 1:
        return <TypePanel setPanel={setPanel} />;
      case 2:
        return <CreatePanel />;
      case 3:
        return <PreviewPanel />;
      default:
        return <TypePanel setPanel={setPanel} />;
    }
  };

  return (
    <>

    <div id={css.screen_unsupported} className="container">
      <span>This page isn't supported for small screen devices. Please use a computer.</span>
    </div>

    <Header currentPanel={panel} setPanel={setPanel} />

    {renderPanel()}

    </>
  )
}

export default FormCreation
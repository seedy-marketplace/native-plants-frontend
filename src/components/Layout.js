import React from 'react';

import Navbar from './Navbar';

export default function Layout(props) {
  console.log("Layout props: ", props);
  return (
    <div className="page-body">
      <Navbar />
      {props.children}
    </div>
  )
}
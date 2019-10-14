import React from 'react';
import './basic.scss';
import { Button } from "unknown";
import "unknown/Button/style/index.scss";

export default function demo() {
  return (
    <div>
      <Button className="btn">Click me</Button>
      <Button className="btn" fill>
        Click me
      </Button>
    </div>
  );
}

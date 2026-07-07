import { Component } from 'react'

/** If WebGL fails / is unavailable, quietly fall back to the CSS backdrop. */
export default class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err) {
    console.warn('[NEXUS] 3D scene disabled:', err?.message)
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

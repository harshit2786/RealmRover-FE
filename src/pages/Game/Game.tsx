import MapComponent from '.'
import { TestingBlocked, TestingElements } from '@/lib/testing'

const Game = () => {
  return (
    <MapComponent width={12} height={6} elements={TestingElements} blockedCoordinates={TestingBlocked}/>
  )
}

export default Game

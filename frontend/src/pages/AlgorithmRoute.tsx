import { useParams } from 'react-router-dom'
import { AlgorithmPage } from '../components/simulator/AlgorithmPage'

export function AlgorithmRoute() {
  const { id = '' } = useParams()
  return <AlgorithmPage id={id} />
}
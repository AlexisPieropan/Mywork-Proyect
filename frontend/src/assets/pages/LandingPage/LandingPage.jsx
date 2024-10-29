import Navbar from '../../components/Navbar/Navbar'
import Proceso from '../Proceso/Proceso'
import Carousel from '../../components/Carousel/Carousel'
import Nosotros from '../Nosotros/Nosotros'
import Footer from '../../components/Footer/Footer'


function LandingPage() {

  return (
    <div >
      <Navbar />
      <Proceso />
      <Carousel/>
      <Carousel/>
      <Nosotros />
      <Footer />
    </div>
  )
}

export default LandingPage

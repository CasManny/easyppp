import { getProducts } from '@/server/db/products'
import { auth } from '@clerk/nextjs/server'
import NoProducts from './_components/NoProducts'

const Dashboard = async () => {
  const { userId, redirectToSignIn } = await auth()
  if(userId == null) return  redirectToSignIn()
  const products = await getProducts(userId, { limit: 6 })
  console.log(products)
  if(products.length === 0) return <NoProducts />
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard
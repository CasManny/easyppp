import React from 'react'
import PageWithBackButton from '../../_components/PageWithBackButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductDetailsForm from '../../_components/forms/ProductDetailsForm'

const NewProductPage = () => {
    return (
        <PageWithBackButton backButtonHref='/dashboards/products' pageTitle='New product'>
            <Card>
                <CardHeader>
                    <CardTitle className='text-xl'>Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProductDetailsForm />
                </CardContent>
            </Card>
      </PageWithBackButton>
  )
}

export default NewProductPage
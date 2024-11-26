import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductCustomizationForm from './forms/ProductCustomizationForm'

const CustomizationTabs = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-xl'>Banner customization</CardTitle>
            </CardHeader>
            <CardContent>
                <ProductCustomizationForm />
            </CardContent>
      </Card>
  )
}

export default CustomizationTabs
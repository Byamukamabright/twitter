import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SignUp from './SignUp'

const queryClient = new QueryClient({})

const SignUpPage = () => {
  return (
	<QueryClientProvider client={queryClient}>
		<SignUp />
	</QueryClientProvider>
	
  )
}

export default SignUpPage

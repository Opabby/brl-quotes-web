import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  HStack,
  Button,
} from '@chakra-ui/react';
import { ColorModeButton } from './components/ui/color-mode';
import { AveragePage } from './AveragePage';
import { QuotesPage } from './QuotesPage';
import { SlippagePage } from './SlippagePage';

type Page = 'home' | 'quotes' | 'average' | 'slippage';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return (
    <Box minH="100vh" bg="bg.canvas">
      <Box
        as="header"
        bg="bg.subtle"
        borderBottom="1px"
        borderColor="border.default"
        py={4}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container maxW="container.xl">
          <HStack justify="space-between">
            <HStack gap={6}>
              <Heading size="lg" color="text.primary">
                BRL Quotes
              </Heading>
              
              <HStack gap={2}>
                <Button
                  variant={currentPage === 'home' ? 'solid' : 'ghost'}
                  colorScheme={currentPage === 'home' ? 'blue' : 'gray'}
                  onClick={() => setCurrentPage('home')}
                >
                  Home
                </Button>
                <Button
                  variant={currentPage === 'quotes' ? 'solid' : 'ghost'}
                  colorScheme={currentPage === 'quotes' ? 'blue' : 'gray'}
                  onClick={() => setCurrentPage('quotes')}
                >
                  Quotes
                </Button>
                <Button
                  variant={currentPage === 'average' ? 'solid' : 'ghost'}
                  colorScheme={currentPage === 'average' ? 'blue' : 'gray'}
                  onClick={() => setCurrentPage('average')}
                >
                  Average
                </Button>
                <Button
                  variant={currentPage === 'slippage' ? 'solid' : 'ghost'}
                  colorScheme={currentPage === 'slippage' ? 'blue' : 'gray'}
                  onClick={() => setCurrentPage('slippage')}
                >
                  Slippage
                </Button>
              </HStack>
            </HStack>
            
            <ColorModeButton />
          </HStack>
        </Container>
      </Box>

      {currentPage === 'quotes' ? (
        <QuotesPage />
      ) : currentPage === 'average' ? (
        <AveragePage />
      ) : currentPage === 'slippage' ? (
        <SlippagePage />
      ) : (
        <Container maxW="container.xl" py={10}>
          <Box textAlign="center">
            <Heading size="2xl" mb={4} color="text.primary">
              Welcome to BRL Quotes
            </Heading>
            <Heading size="lg" mb={6} color="text.secondary" fontWeight="normal">
              Real-time USD to BRL currency exchange rates
            </Heading>
            
            <Box
              bg="bg.subtle"
              p={8}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="border.default"
              maxW="600px"
              mx="auto"
              mt={8}
            >
              <Heading size="md" mb={4} color="text.primary">
                Available Features
              </Heading>
              <Box textAlign="left" color="text.secondary">
                <Box mb={3}>
                  <strong>💱 Quotes:</strong> View individual exchange rates from each source
                  (Wise, Nubank, and Nomad) with detailed breakdowns.
                </Box>
                <Box mb={3}>
                  <strong>📊 Average:</strong> See the average exchange rates calculated
                  from all sources with spread analysis.
                </Box>
                <Box>
                  <strong>📈 Slippage:</strong> Compare how each provider's rates differ
                  from the market average. Find the best deals!
                </Box>
                <Box mt={4} pt={4} borderTopWidth="1px" borderColor="border.default">
                  Click on any option in the navigation above to explore the data!
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      )}
    </Box>
  );
}

export default App;
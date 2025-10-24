import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  HStack,
  Button,
  VStack,
  IconButton,
} from '@chakra-ui/react';
import { ColorModeButton } from './components/ui/color-mode';
import { AveragePage } from './pages/AveragePage';
import { QuotesPage } from './pages/QuotesPage';
import { SlippagePage } from './pages/SlippagePage';
import { HiMenu, HiX } from 'react-icons/hi';

type Page = 'home' | 'quotes' | 'average' | 'slippage';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false); // Close menu after navigation
  };

  return (
    <Box minH="100vh" bg="bg.canvas">
      <Box
        as="header"
        bg="bg.subtle"
        borderBottom="1px"
        borderColor="border.default"
        py={{ base: 3, md: 4 }}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
          <HStack justify="space-between" w="full">
            {/* Logo and Title */}
            <Heading 
              size={{ base: 'md', md: 'lg' }} 
              color="text.primary"
            >
              BRL Quotes
            </Heading>

            {/* Desktop Navigation */}
            <HStack 
              gap={2}
              display={{ base: 'none', lg: 'flex' }}
            >
              <Button
                variant={currentPage === 'home' ? 'solid' : 'ghost'}
                colorScheme={currentPage === 'home' ? 'blue' : 'gray'}
                onClick={() => handlePageChange('home')}
                size="md"
              >
                Home
              </Button>
              <Button
                variant={currentPage === 'quotes' ? 'solid' : 'ghost'}
                colorScheme={currentPage === 'quotes' ? 'blue' : 'gray'}
                onClick={() => handlePageChange('quotes')}
                size="md"
              >
                Quotes
              </Button>
              <Button
                variant={currentPage === 'average' ? 'solid' : 'ghost'}
                colorScheme={currentPage === 'average' ? 'blue' : 'gray'}
                onClick={() => handlePageChange('average')}
                size="md"
              >
                Average
              </Button>
              <Button
                variant={currentPage === 'slippage' ? 'solid' : 'ghost'}
                colorScheme={currentPage === 'slippage' ? 'blue' : 'gray'}
                onClick={() => handlePageChange('slippage')}
                size="md"
              >
                Slippage
              </Button>
              <ColorModeButton />
            </HStack>

            {/* Mobile Menu Button and Color Mode */}
            <HStack gap={2} display={{ base: 'flex', lg: 'none' }}>
              <ColorModeButton />
              <IconButton
                aria-label="Toggle menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                size="md"
              >
                {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </IconButton>
            </HStack>
          </HStack>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <VStack
              display={{ base: 'flex', lg: 'none' }}
              align="stretch"
              gap={2}
              mt={4}
              pb={2}
            >
              <Button
                variant={currentPage === 'home' ? 'solid' : 'ghost'}
                colorScheme={currentPage === 'home' ? 'blue' : 'gray'}
                onClick={() => handlePageChange('home')}
                size="md"
                w="full"
                justifyContent="flex-start"
              >
                Home
              </Button>
              <Button
                variant={currentPage === 'quotes' ? 'solid' : 'ghost'}
                colorScheme={currentPage === 'quotes' ? 'blue' : 'gray'}
                onClick={() => handlePageChange('quotes')}
                size="md"
                w="full"
                justifyContent="flex-start"
              >
                Quotes
              </Button>
              <Button
                variant={currentPage === 'average' ? 'solid' : 'ghost'}
                colorScheme={currentPage === 'average' ? 'blue' : 'gray'}
                onClick={() => handlePageChange('average')}
                size="md"
                w="full"
                justifyContent="flex-start"
              >
                Average
              </Button>
              <Button
                variant={currentPage === 'slippage' ? 'solid' : 'ghost'}
                colorScheme={currentPage === 'slippage' ? 'blue' : 'gray'}
                onClick={() => handlePageChange('slippage')}
                size="md"
                w="full"
                justifyContent="flex-start"
              >
                Slippage
              </Button>
            </VStack>
          )}
        </Container>
      </Box>

      {currentPage === 'quotes' ? (
        <QuotesPage />
      ) : currentPage === 'average' ? (
        <AveragePage />
      ) : currentPage === 'slippage' ? (
        <SlippagePage />
      ) : (
        <Container maxW="container.xl" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6 }}>
          <VStack gap={{ base: 6, md: 8 }} textAlign="center">
            <Heading 
              size={{ base: 'xl', md: '2xl' }} 
              mb={{ base: 2, md: 4 }} 
              color="text.primary"
              px={{ base: 2, md: 0 }}
            >
              Welcome to BRL Quotes
            </Heading>
            <Heading 
              size={{ base: 'md', md: 'lg' }} 
              mb={{ base: 4, md: 6 }} 
              color="text.secondary" 
              fontWeight="normal"
              px={{ base: 2, md: 0 }}
            >
              Real-time USD to BRL currency exchange rates
            </Heading>
            
            <Box
              bg="bg.subtle"
              p={{ base: 5, md: 8 }}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="border.default"
              maxW="600px"
              w="full"
              mx="auto"
              mt={{ base: 4, md: 8 }}
            >
              <Heading 
                size={{ base: 'sm', md: 'md' }} 
                mb={{ base: 3, md: 4 }} 
                color="text.primary"
              >
                Available Features
              </Heading>
              <VStack 
                align="stretch" 
                gap={{ base: 3, md: 4 }} 
                textAlign="left" 
                color="text.secondary"
                fontSize={{ base: 'sm', md: 'md' }}
              >
                <Box>
                  <strong>💱 Quotes:</strong> View individual exchange rates from each source
                  (Wise, Nubank, and Nomad) with detailed breakdowns.
                </Box>
                <Box>
                  <strong>📊 Average:</strong> See the average exchange rates calculated
                  from all sources with spread analysis.
                </Box>
                <Box>
                  <strong>📈 Slippage:</strong> Compare how each provider's rates differ
                  from the market average. Find the best deals!
                </Box>
                <Box 
                  mt={{ base: 2, md: 4 }} 
                  pt={{ base: 3, md: 4 }} 
                  borderTopWidth="1px" 
                  borderColor="border.default"
                >
                  Click on any option in the navigation above to explore the data!
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Container>
      )}
    </Box>
  );
}

export default App;
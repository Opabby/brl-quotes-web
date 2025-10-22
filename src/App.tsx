import { useEffect, useState } from 'react';
import { Box, Container, Heading, Text, VStack, HStack, Card, Spinner } from "@chakra-ui/react";
import { ColorModeButton } from "./components/ui/color-mode";
import { apiService } from './services/api';
import type { Quote } from './types/api';

function App() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getQuotes();
        setQuotes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch quotes');
        console.error('Error fetching quotes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchQuotes, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(price);
  };

  const getProviderName = (quote: Quote): string => {
    return quote.additional_info?.provider || 'Unknown';
  };

  return (
    <Box minH="100vh" bg="bg.canvas">
      {/* Header with dark mode toggle */}
      <Box 
        as="header" 
        bg="bg.subtle" 
        borderBottom="1px" 
        borderColor="border.default"
        py={4}
      >
        <Container maxW="container.xl">
          <HStack justify="space-between">
            <Heading size="lg" color="text.primary">
              BRL Quotes
            </Heading>
            <ColorModeButton />
          </HStack>
        </Container>
      </Box>

      {/* Main content */}
      <Container maxW="container.xl" py={10}>
        <VStack gap={8} align="stretch">
          {/* Welcome Section */}
          <Box textAlign="center">
            <Heading size="2xl" mb={4} color="text.primary">
              Currency Exchange Rates
            </Heading>
            <Text fontSize="lg" color="text.secondary">
              Real-time BRL to USD conversion rates from multiple sources
            </Text>
          </Box>

          {/* Error Alert */}
          {error && (
            <Box 
              bg="red.50" 
              borderLeft="4px" 
              borderColor="red.500" 
              p={4} 
              borderRadius="md"
              _dark={{ bg: "red.900/20", borderColor: "red.500" }}
            >
              <Heading size="sm" color="red.700" _dark={{ color: "red.300" }} mb={1}>
                Error loading quotes
              </Heading>
              <Text color="red.600" _dark={{ color: "red.400" }}>
                {error}
              </Text>
            </Box>
          )}

          {/* Loading State */}
          {loading && (
            <Box textAlign="center" py={10}>
              <Spinner size="xl" color="blue.500" />
              <Text mt={4} color="text.secondary">Loading exchange rates...</Text>
            </Box>
          )}

          {/* Quotes Cards */}
          {!loading && !error && (
            <HStack gap={6} wrap="wrap" justify="center" alignItems="stretch">
              {quotes.map((quote, index) => (
                <Card.Root 
                  key={index}
                  width={{ base: "full", md: "300px" }}
                  height="auto"
                  minH="420px"
                  bg="bg.subtle"
                  borderColor="border.default"
                  display="flex"
                  flexDirection="column"
                >
                  <Card.Body display="flex" flexDirection="column" flex="1">
                    <VStack align="center" gap={3} flex="1" textAlign="center" w="full">
                      <Heading size="md" color="text.primary">
                        {getProviderName(quote)}
                      </Heading>
                      
                      <Text color="text.secondary" fontSize="sm">
                        Updated: {new Date(quote.timestamp).toLocaleTimeString('pt-BR')}
                      </Text>
                      
                      <Box 
                        bg="bg.muted" 
                        p={4} 
                        borderRadius="md" 
                        w="full"
                        flex="1"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <VStack align="center" gap={3} w="full">
                          <Box w="full">
                            <Text color="text.muted" fontSize="sm" mb={1}>Buy Price</Text>
                            <Text color="green.500" fontWeight="bold" fontSize="xl">
                              {formatPrice(quote.buy_price)}
                            </Text>
                          </Box>
                          
                          <Box w="full">
                            <Text color="text.muted" fontSize="sm" mb={1}>Sell Price</Text>
                            <Text color="red.500" fontWeight="bold" fontSize="xl">
                              {formatPrice(quote.sell_price)}
                            </Text>
                          </Box>

                          {quote.additional_info?.mid_market_rate && (
                            <Box w="full">
                              <Text color="text.muted" fontSize="sm" mb={1}>Mid Market</Text>
                              <Text color="text.primary" fontWeight="medium" fontSize="md">
                                {formatPrice(quote.additional_info.mid_market_rate)}
                              </Text>
                            </Box>
                          )}

                          {quote.additional_info?.spread_percentage !== undefined && (
                            <Box w="full">
                              <Text color="text.muted" fontSize="sm" mb={1}>Spread</Text>
                              <Text color="text.primary" fontWeight="medium" fontSize="md">
                                {quote.additional_info.spread_percentage.toFixed(2)}%
                              </Text>
                            </Box>
                          )}
                        </VStack>
                      </Box>

                      {quote.additional_info?.note && (
                        <Text fontSize="xs" color="text.muted" fontStyle="italic" mt={2}>
                          {quote.additional_info.note}
                        </Text>
                      )}
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </HStack>
          )}

          {!loading && !error && quotes.length === 0 && (
            <Box textAlign="center" py={10}>
              <Text color="text.secondary">No quotes available at the moment</Text>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

export default App;
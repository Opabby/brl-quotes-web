import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  Spinner,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import { apiService } from '../services/api';
import { useApiData } from '../hooks/useApiData';
import { formatCurrency, formatTimestamp } from '../utils/formatters';
import { getProviderColor } from '../utils/constants';
import type { Quote } from '../types/api';

export function QuotesPage() {
  const { data: quotes, loading, error } = useApiData(
    () => apiService.getQuotes(),
    'Failed to load quotes'
  );

  const calculateSpread = (quote: Quote) => {
    const spread = quote.buy_price - quote.sell_price;
    const spreadPercentage = (spread / quote.buy_price) * 100;
    return { spread, spreadPercentage };
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6 }}>
        <VStack gap={{ base: 6, md: 8 }} align="center">
          <Spinner size="xl" color="blue.500" />
          <Text fontSize={{ base: 'md', md: 'lg' }} color="text.secondary">
            Loading quotes from all sources...
          </Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6 }}>
        <Card.Root bg="red.50" borderColor="red.200">
          <Card.Body p={{ base: 4, md: 6 }}>
            <VStack align="start" gap={3}>
              <Heading size={{ base: 'sm', md: 'md' }} color="red.600">
                Error Loading Data
              </Heading>
              <Text color="red.700" fontSize={{ base: 'sm', md: 'md' }}>
                {error}
              </Text>
              <Text color="text.muted" fontSize="sm">
                Make sure your API is running properly
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Container>
    );
  }

  if (!quotes || quotes.length === 0) {
    return (
      <Container maxW="container.xl" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6 }}>
        <Box textAlign="center">
          <Heading size={{ base: 'md', md: 'lg' }} color="text.muted">
            No quotes available
          </Heading>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6 }}>
      <VStack gap={{ base: 6, md: 8 }} align="stretch">
        <Box textAlign="center" px={{ base: 2, md: 0 }}>
          <Heading 
            size={{ base: 'xl', md: '2xl' }} 
            mb={{ base: 1, md: 2 }} 
            color="text.primary"
          >
            Exchange Rate Quotes
          </Heading>
          <Text 
            fontSize={{ base: 'md', md: 'lg' }} 
            color="text.secondary" 
            mb={{ base: 3, md: 4 }}
          >
            Real-time rates from {quotes.length} sources
          </Text>
          <Badge 
            colorScheme="green" 
            fontSize={{ base: 'xs', md: 'sm' }} 
            px={{ base: 2, md: 3 }} 
            py={1}
          >
            Live Data
          </Badge>
        </Box>

        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 3 }} 
          gap={{ base: 4, md: 6 }}
        >
          {quotes.map((quote, index) => {
            const { spread, spreadPercentage } = calculateSpread(quote);
            const providerColor = getProviderColor(quote.additional_info?.provider);

            return (
              <Card.Root
                key={index}
                borderWidth="2px"
                borderColor={`${providerColor}.200`}
                shadow="md"
                transition="all 0.2s"
                _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
              >
                <Card.Header pb={2} px={{ base: 4, md: 6 }} pt={{ base: 4, md: 6 }}>
                  <HStack justify="space-between" align="start" flexWrap="wrap" gap={2}>
                    <Box flex="1" minW="0">
                      <Heading 
                        size={{ base: 'sm', md: 'md' }} 
                        color="text.primary" 
                        mb={1}
                      >
                        {quote.additional_info?.provider || 'Unknown'}
                      </Heading>
                      {quote.additional_info?.currency_pair && (
                        <Badge 
                          colorScheme={providerColor} 
                          fontSize={{ base: '2xs', md: 'xs' }}
                        >
                          {quote.additional_info.currency_pair}
                        </Badge>
                      )}
                    </Box>
                  </HStack>
                </Card.Header>

                <Card.Body py={{ base: 3, md: 4 }} px={{ base: 4, md: 6 }}>
                  <VStack gap={{ base: 3, md: 4 }} align="stretch">
                    <Box
                      bg="green.50"
                      p={{ base: 2.5, md: 3 }}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="green.200"
                    >
                      <Text fontSize="xs" color="text.muted" mb={1}>
                        Buy Price (USD → BRL)
                      </Text>
                      <Text 
                        fontSize={{ base: 'xl', md: '2xl' }} 
                        fontWeight="bold" 
                        color="green.600"
                      >
                        {formatCurrency(quote.buy_price)}
                      </Text>
                    </Box>

                    <Box
                      bg="blue.50"
                      p={{ base: 2.5, md: 3 }}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="blue.200"
                    >
                      <Text fontSize="xs" color="text.muted" mb={1}>
                        Sell Price (BRL → USD)
                      </Text>
                      <Text 
                        fontSize={{ base: 'xl', md: '2xl' }} 
                        fontWeight="bold" 
                        color="blue.600"
                      >
                        {formatCurrency(quote.sell_price)}
                      </Text>
                    </Box>

                    <Box
                      bg="orange.50"
                      p={{ base: 2.5, md: 3 }}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="orange.200"
                      textAlign="center"
                    >
                      <Text fontSize="xs" color="text.muted" mb={1}>
                        Spread
                      </Text>
                      <Text 
                        fontSize={{ base: 'md', md: 'lg' }} 
                        fontWeight="bold" 
                        color="orange.600"
                      >
                        {formatCurrency(spread)}
                      </Text>
                      <Text fontSize="xs" color="text.secondary">
                        ({spreadPercentage.toFixed(2)}%)
                      </Text>
                    </Box>

                    {quote.additional_info && (
                      <Box 
                        pt={{ base: 1.5, md: 2 }} 
                        borderTopWidth="1px" 
                        borderColor="border.default"
                      >
                        <VStack align="stretch" gap={1}>
                          {quote.additional_info.mid_market_rate && (
                            <HStack 
                              justify="space-between" 
                              fontSize="xs"
                              flexWrap="wrap"
                              gap={1}
                            >
                              <Text color="text.muted">Mid-Market:</Text>
                              <Text color="text.primary" fontWeight="medium">
                                {formatCurrency(quote.additional_info.mid_market_rate)}
                              </Text>
                            </HStack>
                          )}
                          {quote.additional_info.spread_percentage !== undefined && (
                            <HStack 
                              justify="space-between" 
                              fontSize="xs"
                              flexWrap="wrap"
                              gap={1}
                            >
                              <Text color="text.muted">Spread %:</Text>
                              <Text color="text.primary" fontWeight="medium">
                                {quote.additional_info.spread_percentage.toFixed(2)}%
                              </Text>
                            </HStack>
                          )}
                          {quote.additional_info.date && (
                            <HStack 
                              justify="space-between" 
                              fontSize="xs"
                              flexWrap="wrap"
                              gap={1}
                            >
                              <Text color="text.muted">Date:</Text>
                              <Text color="text.primary" fontWeight="medium">
                                {quote.additional_info.date}
                              </Text>
                            </HStack>
                          )}
                        </VStack>
                      </Box>
                    )}

                    {quote.additional_info?.note && (
                      <Box
                        bg="bg.muted"
                        p={{ base: 2, md: 2.5 }}
                        borderRadius="md"
                        fontSize="xs"
                        color="text.secondary"
                        lineHeight="1.5"
                      >
                        💡 {quote.additional_info.note}
                      </Box>
                    )}
                  </VStack>
                </Card.Body>

                <Card.Footer 
                  pt={{ base: 1.5, md: 2 }} 
                  px={{ base: 4, md: 6 }} 
                  pb={{ base: 4, md: 6 }}
                >
                  <VStack align="stretch" w="full" gap={1}>
                    <Text fontSize="xs" color="text.muted">
                      Source: {quote.source}
                    </Text>
                    <Text fontSize="xs" color="text.muted">
                      Updated: {formatTimestamp(quote.timestamp)}
                    </Text>
                  </VStack>
                </Card.Footer>
              </Card.Root>
            );
          })}
        </SimpleGrid>

        <Card.Root bg="bg.subtle" borderColor="border.default">
          <Card.Header px={{ base: 4, md: 6 }} pt={{ base: 4, md: 6 }} pb={{ base: 2, md: 4 }}>
            <Heading size={{ base: 'sm', md: 'md' }} color="text.primary">
              Quick Summary
            </Heading>
          </Card.Header>
          <Card.Body px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
            <SimpleGrid 
              columns={{ base: 1, sm: 3 }} 
              gap={{ base: 3, md: 4 }}
            >
              <Box textAlign="center" p={{ base: 2, md: 0 }}>
                <Text 
                  fontSize={{ base: 'xs', md: 'sm' }} 
                  color="text.muted" 
                  mb={1}
                >
                  Lowest Buy Price
                </Text>
                <Text 
                  fontSize={{ base: 'xl', md: '2xl' }} 
                  fontWeight="bold" 
                  color="green.600"
                >
                  {formatCurrency(Math.min(...quotes.map(q => q.buy_price)))}
                </Text>
              </Box>
              <Box textAlign="center" p={{ base: 2, md: 0 }}>
                <Text 
                  fontSize={{ base: 'xs', md: 'sm' }} 
                  color="text.muted" 
                  mb={1}
                >
                  Highest Sell Price
                </Text>
                <Text 
                  fontSize={{ base: 'xl', md: '2xl' }} 
                  fontWeight="bold" 
                  color="blue.600"
                >
                  {formatCurrency(Math.max(...quotes.map(q => q.sell_price)))}
                </Text>
              </Box>
              <Box textAlign="center" p={{ base: 2, md: 0 }}>
                <Text 
                  fontSize={{ base: 'xs', md: 'sm' }} 
                  color="text.muted" 
                  mb={1}
                >
                  Best Spread
                </Text>
                <Text 
                  fontSize={{ base: 'xl', md: '2xl' }} 
                  fontWeight="bold" 
                  color="orange.600"
                >
                  {formatCurrency(
                    Math.min(...quotes.map(q => q.buy_price - q.sell_price))
                  )}
                </Text>
              </Box>
            </SimpleGrid>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Container>
  );
}
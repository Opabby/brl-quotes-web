import { useState, useEffect } from 'react';
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
import { apiService } from './services/api';
import type { Slippage } from './types/api';

export function SlippagePage() {
  const [slippages, setSlippages] = useState<Slippage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSlippage = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getSlippage();
        setSlippages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load slippage data');
        console.error('Error fetching slippage:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSlippage();
  }, []);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(4)}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'medium',
    });
  };

  const getProviderColor = (provider?: string): string => {
    const colors: Record<string, string> = {
      'Wise': 'green',
      'Nubank': 'purple',
      'Nomad Global': 'blue',
    };
    return colors[provider || ''] || 'gray';
  };

  const getSlippageColor = (slippage: number, type: 'buy' | 'sell'): string => {
    if (slippage === 0) return 'gray';
    
    if (type === 'buy') {
      return slippage < 0 ? 'green' : 'red';
    } else {
      return slippage > 0 ? 'green' : 'red';
    }
  };

  const getSlippageLabel = (slippage: number, type: 'buy' | 'sell'): string => {
    if (slippage === 0) return 'At Average';
    
    if (type === 'buy') {
      return slippage > 0 ? 'Above Average' : 'Below Average';
    } else {
      return slippage > 0 ? 'Above Average' : 'Below Average';
    }
  };

  const getSlippageDescription = (slippage: number, type: 'buy' | 'sell'): string => {
    if (slippage === 0) return 'Same as market average';
    
    if (type === 'buy') {
      return slippage < 0 ? '✅ Better than average' : '⚠️ Worse than average';
    } else {
      return slippage > 0 ? '✅ Better than average' : '⚠️ Worse than average';
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack gap={8} align="center">
          <Spinner size="xl" color="blue.500" />
          <Text fontSize="lg" color="text.secondary">
            Analyzing slippage from all sources...
          </Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={10}>
        <Card.Root bg="red.50" borderColor="red.200">
          <Card.Body>
            <VStack align="start" gap={3}>
              <Heading size="md" color="red.600">
                Error Loading Data
              </Heading>
              <Text color="red.700">{error}</Text>
              <Text color="text.muted" fontSize="sm">
                Make sure your API is running at http://localhost:3000
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Container>
    );
  }

  if (slippages.length === 0) {
    return (
      <Container maxW="container.xl" py={10}>
        <Box textAlign="center">
          <Heading size="lg" color="text.muted">
            No slippage data available
          </Heading>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack gap={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" mb={2} color="text.primary">
            Slippage Analysis
          </Heading>
          <Text fontSize="lg" color="text.secondary" mb={4}>
            How each provider compares to the market average
          </Text>
          <Badge colorScheme="orange" fontSize="sm" px={3} py={1}>
            Percentage Difference
          </Badge>
        </Box>

        <Card.Root bg="blue.50" borderColor="blue.200">
          <Card.Body>
            <VStack align="start" gap={2}>
              <Heading size="sm" color="blue.800">
                💡 Understanding Slippage
              </Heading>
              <Text fontSize="sm" color="blue.700">
                <strong>Slippage</strong> shows how much each provider's rates differ from the market average.
              </Text>
              <HStack gap={4} wrap="wrap" fontSize="xs" color="blue.600">
                <Box>
                  <strong>Negative %:</strong> Below average (better for buy)
                </Box>
                <Box>
                  <strong>Positive %:</strong> Above average (worse for buy)
                </Box>
                <Box>
                  <strong>0%:</strong> Exactly at average
                </Box>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {slippages.map((slippage, index) => {
            const providerColor = getProviderColor(slippage.additional_info?.provider);
            const buySlippageColor = getSlippageColor(slippage.buy_price_slippage, 'buy');
            const sellSlippageColor = getSlippageColor(slippage.sell_price_slippage, 'sell');

            return (
              <Card.Root
                key={index}
                borderWidth="2px"
                borderColor={`${providerColor}.200`}
                shadow="md"
                transition="all 0.2s"
                _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
              >
                <Card.Header pb={2}>
                  <HStack justify="space-between" align="start">
                    <Box>
                      <Heading size="md" color="text.primary" mb={1}>
                        {slippage.additional_info?.provider || 'Unknown'}
                      </Heading>
                      <Badge colorScheme={providerColor} fontSize="xs">
                        vs Market Average
                      </Badge>
                    </Box>
                  </HStack>
                </Card.Header>

                <Card.Body py={4}>
                  <VStack gap={4} align="stretch">
                    <Box
                      bg={`${buySlippageColor}.50`}
                      p={3}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={`${buySlippageColor}.200`}
                    >
                      <Text fontSize="xs" color="text.muted" mb={1}>
                        Buy Price Slippage
                      </Text>
                      <Text fontSize="3xl" fontWeight="bold" color={`${buySlippageColor}.600`}>
                        {formatPercentage(slippage.buy_price_slippage)}
                      </Text>
                      <Text fontSize="xs" color="text.secondary" mt={1}>
                        {getSlippageLabel(slippage.buy_price_slippage, 'buy')}
                      </Text>
                      <Text fontSize="xs" color={`${buySlippageColor}.700`} mt={1}>
                        {getSlippageDescription(slippage.buy_price_slippage, 'buy')}
                      </Text>
                    </Box>

                    <Box
                      bg={`${sellSlippageColor}.50`}
                      p={3}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={`${sellSlippageColor}.200`}
                    >
                      <Text fontSize="xs" color="text.muted" mb={1}>
                        Sell Price Slippage
                      </Text>
                      <Text fontSize="3xl" fontWeight="bold" color={`${sellSlippageColor}.600`}>
                        {formatPercentage(slippage.sell_price_slippage)}
                      </Text>
                      <Text fontSize="xs" color="text.secondary" mt={1}>
                        {getSlippageLabel(slippage.sell_price_slippage, 'sell')}
                      </Text>
                      <Text fontSize="xs" color={`${sellSlippageColor}.700`} mt={1}>
                        {getSlippageDescription(slippage.sell_price_slippage, 'sell')}
                      </Text>
                    </Box>

                    <Box
                      pt={3}
                      borderTopWidth="1px"
                      borderColor="border.default"
                    >
                      <Text fontSize="xs" fontWeight="bold" color="text.primary" mb={2}>
                        Detailed Comparison
                      </Text>
                      <VStack align="stretch" gap={1}>
                        <HStack justify="space-between" fontSize="xs">
                          <Text color="text.muted">Provider Buy:</Text>
                          <Text color="text.primary" fontWeight="medium">
                            {formatCurrency(slippage.additional_info.quote_buy_price)}
                          </Text>
                        </HStack>
                        <HStack justify="space-between" fontSize="xs">
                          <Text color="text.muted">Average Buy:</Text>
                          <Text color="text.primary" fontWeight="medium">
                            {formatCurrency(slippage.additional_info.average_buy_price)}
                          </Text>
                        </HStack>
                        <Box h={2} />
                        <HStack justify="space-between" fontSize="xs">
                          <Text color="text.muted">Provider Sell:</Text>
                          <Text color="text.primary" fontWeight="medium">
                            {formatCurrency(slippage.additional_info.quote_sell_price)}
                          </Text>
                        </HStack>
                        <HStack justify="space-between" fontSize="xs">
                          <Text color="text.muted">Average Sell:</Text>
                          <Text color="text.primary" fontWeight="medium">
                            {formatCurrency(slippage.additional_info.average_sell_price)}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>

                    <Box
                      bg="bg.muted"
                      p={2}
                      borderRadius="md"
                      fontSize="xs"
                    >
                      <HStack justify="space-between">
                        <Text color="text.muted">Buy Difference:</Text>
                        <Text 
                          color={buySlippageColor === 'green' ? 'green.600' : 'red.600'}
                          fontWeight="bold"
                        >
                          {formatCurrency(
                            slippage.additional_info.quote_buy_price - 
                            slippage.additional_info.average_buy_price
                          )}
                        </Text>
                      </HStack>
                      <HStack justify="space-between" mt={1}>
                        <Text color="text.muted">Sell Difference:</Text>
                        <Text 
                          color={sellSlippageColor === 'green' ? 'green.600' : 'red.600'}
                          fontWeight="bold"
                        >
                          {formatCurrency(
                            slippage.additional_info.quote_sell_price - 
                            slippage.additional_info.average_sell_price
                          )}
                        </Text>
                      </HStack>
                    </Box>
                  </VStack>
                </Card.Body>

                <Card.Footer pt={2}>
                  <VStack align="stretch" w="full" gap={1}>
                    <Text fontSize="xs" color="text.muted">
                      Source: {slippage.source}
                    </Text>
                    <Text fontSize="xs" color="text.muted">
                      Updated: {formatTimestamp(slippage.timestamp)}
                    </Text>
                  </VStack>
                </Card.Footer>
              </Card.Root>
            );
          })}
        </SimpleGrid>

        <Card.Root bg="bg.subtle" borderColor="border.default">
          <Card.Header>
            <Heading size="md" color="text.primary">
              Best Options
            </Heading>
          </Card.Header>
          <Card.Body>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              <Box>
                <Text fontSize="sm" fontWeight="bold" color="text.primary" mb={3}>
                  🏆 Best for Buying USD (lowest buy price)
                </Text>
                {(() => {
                  const best = slippages.reduce((min, curr) => 
                    curr.buy_price_slippage < min.buy_price_slippage ? curr : min
                  );
                  return (
                    <Box
                      bg="green.50"
                      p={4}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="green.200"
                    >
                      <Heading size="sm" color="green.700" mb={2}>
                        {best.additional_info.provider}
                      </Heading>
                      <Text fontSize="2xl" fontWeight="bold" color="green.600">
                        {formatPercentage(best.buy_price_slippage)}
                      </Text>
                      <Text fontSize="xs" color="green.700" mt={1}>
                        {formatCurrency(best.additional_info.quote_buy_price)} per dollar
                      </Text>
                    </Box>
                  );
                })()}
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="bold" color="text.primary" mb={3}>
                  🏆 Best for Selling BRL (highest sell price)
                </Text>
                {(() => {
                  const best = slippages.reduce((max, curr) => 
                    curr.sell_price_slippage > max.sell_price_slippage ? curr : max
                  );
                  return (
                    <Box
                      bg="blue.50"
                      p={4}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="blue.200"
                    >
                      <Heading size="sm" color="blue.700" mb={2}>
                        {best.additional_info.provider}
                      </Heading>
                      <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                        {formatPercentage(best.sell_price_slippage)}
                      </Text>
                      <Text fontSize="xs" color="blue.700" mt={1}>
                        {formatCurrency(best.additional_info.quote_sell_price)} per dollar
                      </Text>
                    </Box>
                  );
                })()}
              </Box>
            </SimpleGrid>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Container>
  );
}
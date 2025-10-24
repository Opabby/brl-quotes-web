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
import { formatCurrency, formatTimestamp, formatPercentage } from '../utils/formatters';
import { getProviderColor } from '../utils/constants';
// import type { Slippage } from '../types/api';

export function SlippagePage() {
  const { data: slippages, loading, error } = useApiData(
    () => apiService.getSlippage(),
    'Failed to load slippage data'
  );

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
            Calculating slippage analysis...
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
                Make sure your API is running properly
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Container>
    );
  }

  if (!slippages || slippages.length === 0) {
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
            Percentage difference from market average across {slippages.length} sources
          </Text>
          <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
            Live Comparison
          </Badge>
        </Box>

        <Card.Root bg="bg.subtle" borderColor="border.default" p={4}>
          <VStack align="start" gap={2}>
            <Heading size="sm" color="text.primary">
              💡 How to Read Slippage
            </Heading>
            <Text fontSize="sm" color="text.secondary">
              <strong>Buy Price:</strong> Negative slippage = better rate (pay less BRL per USD)
            </Text>
            <Text fontSize="sm" color="text.secondary">
              <strong>Sell Price:</strong> Positive slippage = better rate (receive more BRL per USD)
            </Text>
          </VStack>
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
                          <Text color="text.muted">Market Buy:</Text>
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
                          <Text color="text.muted">Market Sell:</Text>
                          <Text color="text.primary" fontWeight="medium">
                            {formatCurrency(slippage.additional_info.average_sell_price)}
                          </Text>
                        </HStack>
                      </VStack>
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
              Summary
            </Heading>
          </Card.Header>
          <Card.Body>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Box textAlign="center">
                <Text fontSize="sm" color="text.muted" mb={1}>
                  Best Buy Rate (Lowest Slippage)
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  {formatPercentage(
                    Math.min(...slippages.map(s => s.buy_price_slippage))
                  )}
                </Text>
                <Text fontSize="xs" color="text.secondary" mt={1}>
                  {slippages.find(s => s.buy_price_slippage === Math.min(...slippages.map(x => x.buy_price_slippage)))?.additional_info?.provider}
                </Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="sm" color="text.muted" mb={1}>
                  Best Sell Rate (Highest Slippage)
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  {formatPercentage(
                    Math.max(...slippages.map(s => s.sell_price_slippage))
                  )}
                </Text>
                <Text fontSize="xs" color="text.secondary" mt={1}>
                  {slippages.find(s => s.sell_price_slippage === Math.max(...slippages.map(x => x.sell_price_slippage)))?.additional_info?.provider}
                </Text>
              </Box>
            </SimpleGrid>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Container>
  );
}
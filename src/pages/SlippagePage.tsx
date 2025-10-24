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
      <Container maxW="container.xl" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6 }}>
        <VStack gap={{ base: 6, md: 8 }} align="center">
          <Spinner size="xl" color="blue.500" />
          <Text fontSize={{ base: 'md', md: 'lg' }} color="text.secondary">
            Calculating slippage analysis...
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

  if (!slippages || slippages.length === 0) {
    return (
      <Container maxW="container.xl" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6 }}>
        <Box textAlign="center">
          <Heading size={{ base: 'md', md: 'lg' }} color="text.muted">
            No slippage data available
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
            Slippage Analysis
          </Heading>
          <Text 
            fontSize={{ base: 'md', md: 'lg' }} 
            color="text.secondary" 
            mb={{ base: 3, md: 4 }}
          >
            Percentage difference from market average across {slippages.length} sources
          </Text>
          <Badge 
            colorScheme="blue" 
            fontSize={{ base: 'xs', md: 'sm' }} 
            px={{ base: 2, md: 3 }} 
            py={1}
          >
            Live Comparison
          </Badge>
        </Box>

        <Card.Root 
          bg="bg.subtle" 
          borderColor="border.default" 
          p={{ base: 3, md: 4 }}
        >
          <VStack align="start" gap={{ base: 2, md: 3 }}>
            <Heading 
              size={{ base: 'xs', md: 'sm' }} 
              color="text.primary"
            >
              💡 How to Read Slippage
            </Heading>
            <Text 
              fontSize={{ base: 'xs', md: 'sm' }} 
              color="text.secondary"
              lineHeight="1.6"
            >
              <strong>Buy Price:</strong> Negative slippage = better rate (pay less BRL per USD)
            </Text>
            <Text 
              fontSize={{ base: 'xs', md: 'sm' }} 
              color="text.secondary"
              lineHeight="1.6"
            >
              <strong>Sell Price:</strong> Positive slippage = better rate (receive more BRL per USD)
            </Text>
          </VStack>
        </Card.Root>

        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 3 }} 
          gap={{ base: 4, md: 6 }}
        >
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
                <Card.Header 
                  pb={2} 
                  px={{ base: 4, md: 6 }} 
                  pt={{ base: 4, md: 6 }}
                >
                  <HStack 
                    justify="space-between" 
                    align="start" 
                    flexWrap="wrap" 
                    gap={2}
                  >
                    <Box flex="1" minW="0">
                      <Heading 
                        size={{ base: 'sm', md: 'md' }} 
                        color="text.primary" 
                        mb={1}
                      >
                        {slippage.additional_info?.provider || 'Unknown'}
                      </Heading>
                      <Badge 
                        colorScheme={providerColor} 
                        fontSize={{ base: '2xs', md: 'xs' }}
                      >
                        vs Market Average
                      </Badge>
                    </Box>
                  </HStack>
                </Card.Header>

                <Card.Body py={{ base: 3, md: 4 }} px={{ base: 4, md: 6 }}>
                  <VStack gap={{ base: 3, md: 4 }} align="stretch">
                    <Box
                      bg={`${buySlippageColor}.50`}
                      p={{ base: 2.5, md: 3 }}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={`${buySlippageColor}.200`}
                    >
                      <Text fontSize="xs" color="text.muted" mb={1}>
                        Buy Price Slippage
                      </Text>
                      <Text 
                        fontSize={{ base: '2xl', md: '3xl' }} 
                        fontWeight="bold" 
                        color={`${buySlippageColor}.600`}
                      >
                        {formatPercentage(slippage.buy_price_slippage)}
                      </Text>
                      <Text fontSize="xs" color="text.secondary" mt={1}>
                        {getSlippageLabel(slippage.buy_price_slippage, 'buy')}
                      </Text>
                      <Text 
                        fontSize="xs" 
                        color={`${buySlippageColor}.700`} 
                        mt={1}
                        lineHeight="1.4"
                      >
                        {getSlippageDescription(slippage.buy_price_slippage, 'buy')}
                      </Text>
                    </Box>

                    <Box
                      bg={`${sellSlippageColor}.50`}
                      p={{ base: 2.5, md: 3 }}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={`${sellSlippageColor}.200`}
                    >
                      <Text fontSize="xs" color="text.muted" mb={1}>
                        Sell Price Slippage
                      </Text>
                      <Text 
                        fontSize={{ base: '2xl', md: '3xl' }} 
                        fontWeight="bold" 
                        color={`${sellSlippageColor}.600`}
                      >
                        {formatPercentage(slippage.sell_price_slippage)}
                      </Text>
                      <Text fontSize="xs" color="text.secondary" mt={1}>
                        {getSlippageLabel(slippage.sell_price_slippage, 'sell')}
                      </Text>
                      <Text 
                        fontSize="xs" 
                        color={`${sellSlippageColor}.700`} 
                        mt={1}
                        lineHeight="1.4"
                      >
                        {getSlippageDescription(slippage.sell_price_slippage, 'sell')}
                      </Text>
                    </Box>

                    <Box
                      pt={{ base: 2, md: 3 }}
                      borderTopWidth="1px"
                      borderColor="border.default"
                    >
                      <Text 
                        fontSize="xs" 
                        fontWeight="bold" 
                        color="text.primary" 
                        mb={2}
                      >
                        Detailed Comparison
                      </Text>
                      <VStack align="stretch" gap={1}>
                        <HStack 
                          justify="space-between" 
                          fontSize="xs"
                          flexWrap="wrap"
                          gap={1}
                        >
                          <Text color="text.muted">Provider Buy:</Text>
                          <Text color="text.primary" fontWeight="medium">
                            {formatCurrency(slippage.additional_info.quote_buy_price)}
                          </Text>
                        </HStack>
                        <HStack 
                          justify="space-between" 
                          fontSize="xs"
                          flexWrap="wrap"
                          gap={1}
                        >
                          <Text color="text.muted">Market Buy:</Text>
                          <Text color="text.primary" fontWeight="medium">
                            {formatCurrency(slippage.additional_info.average_buy_price)}
                          </Text>
                        </HStack>
                        <Box h={2} />
                        <HStack 
                          justify="space-between" 
                          fontSize="xs"
                          flexWrap="wrap"
                          gap={1}
                        >
                          <Text color="text.muted">Provider Sell:</Text>
                          <Text color="text.primary" fontWeight="medium">
                            {formatCurrency(slippage.additional_info.quote_sell_price)}
                          </Text>
                        </HStack>
                        <HStack 
                          justify="space-between" 
                          fontSize="xs"
                          flexWrap="wrap"
                          gap={1}
                        >
                          <Text color="text.muted">Market Sell:</Text>
                          <Text color="text.primary" fontWeight="medium">
                            {formatCurrency(slippage.additional_info.average_sell_price)}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                  </VStack>
                </Card.Body>

                <Card.Footer 
                  pt={{ base: 1.5, md: 2 }} 
                  px={{ base: 4, md: 6 }} 
                  pb={{ base: 4, md: 6 }}
                >
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
          <Card.Header 
            px={{ base: 4, md: 6 }} 
            pt={{ base: 4, md: 6 }} 
            pb={{ base: 2, md: 4 }}
          >
            <Heading size={{ base: 'sm', md: 'md' }} color="text.primary">
              Summary
            </Heading>
          </Card.Header>
          <Card.Body px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
            <SimpleGrid 
              columns={{ base: 1, sm: 2 }} 
              gap={{ base: 3, md: 4 }}
            >
              <Box 
                textAlign="center" 
                p={{ base: 3, md: 0 }}
                bg={{ base: 'green.50', md: 'transparent' }}
                borderRadius={{ base: 'md', md: 'none' }}
                borderWidth={{ base: '1px', md: '0' }}
                borderColor={{ base: 'green.200', md: 'transparent' }}
              >
                <Text 
                  fontSize={{ base: 'xs', md: 'sm' }} 
                  color="text.muted" 
                  mb={1}
                >
                  Best Buy Rate (Lowest Slippage)
                </Text>
                <Text 
                  fontSize={{ base: 'xl', md: '2xl' }} 
                  fontWeight="bold" 
                  color="green.600"
                >
                  {formatPercentage(
                    Math.min(...slippages.map(s => s.buy_price_slippage))
                  )}
                </Text>
                <Text 
                  fontSize="xs" 
                  color="text.secondary" 
                  mt={1}
                >
                  {slippages.find(s => s.buy_price_slippage === Math.min(...slippages.map(x => x.buy_price_slippage)))?.additional_info?.provider}
                </Text>
              </Box>
              <Box 
                textAlign="center" 
                p={{ base: 3, md: 0 }}
                bg={{ base: 'blue.50', md: 'transparent' }}
                borderRadius={{ base: 'md', md: 'none' }}
                borderWidth={{ base: '1px', md: '0' }}
                borderColor={{ base: 'blue.200', md: 'transparent' }}
              >
                <Text 
                  fontSize={{ base: 'xs', md: 'sm' }} 
                  color="text.muted" 
                  mb={1}
                >
                  Best Sell Rate (Highest Slippage)
                </Text>
                <Text 
                  fontSize={{ base: 'xl', md: '2xl' }} 
                  fontWeight="bold" 
                  color="blue.600"
                >
                  {formatPercentage(
                    Math.max(...slippages.map(s => s.sell_price_slippage))
                  )}
                </Text>
                <Text 
                  fontSize="xs" 
                  color="text.secondary" 
                  mt={1}
                >
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
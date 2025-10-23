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
} from '@chakra-ui/react';
import { apiService } from './services/api';
import type { Average } from './types/api';

export function AveragePage() {
  const [average, setAverage] = useState<Average | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAverage = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getAverage();
        setAverage(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load average rates');
        console.error('Error fetching average:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAverage();
  }, []);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(4)}`;
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'medium',
    });
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack gap={8} align="center">
          <Spinner size="xl" color="blue.500" />
          <Text fontSize="lg" color="text.secondary">
            Loading average rates...
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

  if (!average) {
    return null;
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack gap={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" mb={2} color="text.primary">
            Average Exchange Rates
          </Heading>
          <Text fontSize="lg" color="text.secondary" mb={4}>
            Calculated from {average.sources_count} sources
          </Text>
        </Box>

        <Card.Root
          bg="gradient-to-br"
          bgGradient="to-br"
          borderWidth="2px"
          borderColor="blue.200"
          shadow="lg"
        >
          <Card.Body>
            <VStack gap={6}>
              <HStack justify="space-around" w="full" wrap="wrap" gap={6}>
                <Box textAlign="center" minW="200px">
                  <Text fontSize="sm" color="text.muted" mb={2}>
                    Average Buy Price
                  </Text>
                  <Text fontSize="4xl" fontWeight="bold" color="green.600">
                    {formatCurrency(average.average_buy_price)}
                  </Text>
                  <Text fontSize="xs" color="text.secondary" mt={1}>
                    USD → BRL
                  </Text>
                </Box>

                <Box textAlign="center" minW="200px">
                  <Text fontSize="sm" color="text.muted" mb={2}>
                    Average Sell Price
                  </Text>
                  <Text fontSize="4xl" fontWeight="bold" color="blue.600">
                    {formatCurrency(average.average_sell_price)}
                  </Text>
                  <Text fontSize="xs" color="text.secondary" mt={1}>
                    BRL → USD
                  </Text>
                </Box>
              </HStack>

              <Box
                w="full"
                bg="bg.muted"
                p={4}
                borderRadius="md"
                textAlign="center"
              >
                <Text fontSize="sm" color="text.muted" mb={1}>
                  Spread
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  {formatCurrency(
                    average.average_buy_price - average.average_sell_price
                  )}
                </Text>
                <Text fontSize="xs" color="text.secondary">
                  ({(
                    ((average.average_buy_price - average.average_sell_price) /
                      average.average_buy_price) *
                    100
                  ).toFixed(2)}
                  %)
                </Text>
              </Box>
            </VStack>
          </Card.Body>
        </Card.Root>

        {average.additional_info?.sources && (
          <Card.Root bg="bg.subtle" borderColor="border.default">
            <Card.Header>
              <Heading size="md" color="text.primary">
                Data Sources
              </Heading>
            </Card.Header>
            <Card.Body>
              <VStack align="start" gap={2}>
                {average.additional_info.sources.map((source, index) => (
                  <HStack key={index} gap={2}>
                    <Badge colorScheme="purple">Source {index + 1}</Badge>
                    <Text fontSize="sm" color="text.secondary" wordBreak="break-all">
                      {source}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Card.Body>
          </Card.Root>
        )}

        <Box textAlign="center">
          <Text fontSize="sm" color="text.muted">
            Last updated: {formatTimestamp(average.timestamp)}
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
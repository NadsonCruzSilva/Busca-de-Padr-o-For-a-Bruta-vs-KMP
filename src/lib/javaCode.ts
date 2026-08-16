// Código-fonte Java dos algoritmos, exibido como material complementar.

export const javaBruteCode = `public static int buscaForcaBruta(String T, String P) {
    int n = T.length(), m = P.length();

    // deslocamento do padrão
    for (int i = 0; i <= n - m; i++) {
        int j = 0;

        // compara o padrão com o texto a partir de i
        while (j < m && T.charAt(i + j) == P.charAt(j))
            j++; // caracteres coincidem

        // ocorrência encontrada em i
        if (j == m) return i;

        // em caso de falha, apenas incrementa o deslocamento
    }

    // padrão não encontrado
    return -1;
}`

export const javaLpsCode = `// LPS: Longest Proper Prefix which is also Suffix
public static int[] calculaLPS(String P) {
    int m = P.length();

    // lps[i]: maior prefixo próprio de P[0..i] que também é sufixo
    int[] lps = new int[m];

    int len = 0; // tamanho do maior prefixo atual
    int i = 1;

    while (i < m) {
        // caracteres coincidem: estende o prefixo/sufixo
        if (P.charAt(i) == P.charAt(len)) {
            lps[i] = ++len;
            i++;
        } else if (len > 0) {
            len = lps[len - 1]; // recua para um prefixo menor
        } else {
            lps[i] = 0; // nenhum prefixo/sufixo
            i++;
        }
    }

    // padrão processado
    return lps;
}`

export const javaKmpCode = `// usa a tabela LPS para não repetir comparações
public static int buscaKMP(String T, String P) {
    int n = T.length(), m = P.length();
    int[] lps = calculaLPS(P); // pré-processamento do padrão

    int i = 0, j = 0; // i no texto, j no padrão

    while (i < n) {
        // caracteres coincidem
        if (T.charAt(i) == P.charAt(j)) {
            i++;
            j++;
        }

        // ocorrência encontrada
        if (j == m)
            return i - j;

        // falha: realinha o padrão usando a LPS
        else if (i < n && T.charAt(i) != P.charAt(j)) {
            if (j > 0)
                j = lps[j - 1]; // i NÃO retrocede no texto
            else
                i++; // j = 0: avança o texto
        }
    }

    // padrão não encontrado
    return -1;
}`
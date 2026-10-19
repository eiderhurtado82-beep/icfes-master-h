import React, { useState } from 'react';
import {
  Code2,
  Cpu,
  Layers,
  CheckCircle,
  Copy,
  Check,
  FolderTree,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { M3Card } from '../components/m3/M3Card';
import { M3Chip } from '../components/m3/M3Chip';
import { M3Button } from '../components/m3/M3Button';

export const ArchitectureScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'simulacro_compose' | 'preguntas_compose' | 'viewmodel' | 'domain'
  >('simulacro_compose');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const kotlinSimulacroScreenCode = `// ========================================================
// MÓDULO DE SIMULACRO OFICIAL SABER 11 (JETPACK COMPOSE + M3)
// Archivo: SimulacroScreen.kt
// Paquete: com.icfesmaster.presentation.ui.simulacro
// ========================================================
package com.icfesmaster.presentation.ui.simulacro

import androidx.compose.animation.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.icfesmaster.domain.model.OptionLetter
import com.icfesmaster.domain.model.Question

// Colores Institucionales Material 3
private val AzulInstitucional = Color(0xFF0B2F64)
private val AzulContenedor = Color(0xFFDCE4F9)
private val VerdeProgreso = Color(0xFF00875A)
private val VerdeContenedor = Color(0xFFAFF2D4)
private val RojoError = Color(0xFFBA1A1A)
private val RojoContenedor = Color(0xFFFFDAD6)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SimulacroScreen(
    viewModel: SimulacroViewModel,
    onNavigateHome: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    var showAnswerSheetModal by remember { mutableStateOf(false) }
    var showExitDialog by remember { mutableStateOf(false) }
    var showFinishDialog by remember { mutableStateOf(false) }

    if (uiState.isCompleted) {
        // Vista de Resultados Calificados con Ponderación ICFES 0 a 500
        ResultadosSimulacroView(
            uiState = uiState,
            onRestart = { viewModel.onEvent(SimulacroEvent.RestartSimulacro) },
            onNavigateHome = onNavigateHome
        )
        return
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Simulacro Oficial Saber 11",
                            fontWeight = FontWeight.Bold,
                            color = AzulInstitucional,
                            fontSize = 16.sp
                        )
                        Text(
                            text = "Condiciones reales de examen",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = { showExitDialog = true }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver", tint = AzulInstitucional)
                    }
                },
                actions = {
                    // Temporizador regresivo institucional M3
                    Surface(
                        color = if (uiState.timeRemainingSeconds < 300) RojoContenedor else AzulContenedor,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.padding(end = 6.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = "⏱ \${uiState.formattedTime}",
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace,
                                fontSize = 12.sp,
                                color = if (uiState.timeRemainingSeconds < 300) RojoError else AzulInstitucional
                            )
                        }
                    }

                    // Botón de Hoja de Respuestas rápida
                    IconButton(onClick = { showAnswerSheetModal = true }) {
                        Icon(
                            imageVector = Icons.Default.List,
                            contentDescription = "Hoja de respuestas",
                            tint = AzulInstitucional
                        )
                    }

                    // Botón de Entrega de Examen
                    Button(
                        onClick = { showFinishDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = VerdeProgreso),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.padding(end = 12.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                    ) {
                        Text(text = "Entregar", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            )
        },
        bottomBar = {
            // Barra Inferior de Navegación entre Preguntas
            Surface(
                tonalElevation = 3.dp,
                shadowElevation = 8.dp,
                color = MaterialTheme.colorScheme.surface
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedButton(
                        onClick = { viewModel.onEvent(SimulacroEvent.PreviousQuestion) },
                        enabled = uiState.currentIndex > 0,
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.KeyboardArrowLeft, contentDescription = null)
                        Text(text = "Anterior", fontWeight = FontWeight.Bold)
                    }

                    TextButton(onClick = { showAnswerSheetModal = true }) {
                        Text(
                            text = "Respondidas: \${uiState.answeredCount}/\${uiState.totalQuestions}",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = AzulInstitucional
                        )
                    }

                    Button(
                        onClick = {
                            if (uiState.currentIndex < uiState.totalQuestions - 1) {
                                viewModel.onEvent(SimulacroEvent.NextQuestion)
                            } else {
                                showFinishDialog = true
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = AzulInstitucional),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = if (uiState.currentIndex < uiState.totalQuestions - 1) "Siguiente" else "Finalizar",
                            fontWeight = FontWeight.Bold
                        )
                        Icon(Icons.Default.KeyboardArrowRight, contentDescription = null)
                    }
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(MaterialTheme.colorScheme.background)
        ) {
            uiState.currentQuestion?.let { question ->
                PreguntaSimulacroView(
                    question = question,
                    currentIndex = uiState.currentIndex,
                    totalQuestions = uiState.totalQuestions,
                    selectedOption = uiState.answers[question.id]?.selectedOption,
                    isMarkedForReview = uiState.answers[question.id]?.isMarkedForReview ?: false,
                    onSelectOption = { viewModel.onEvent(SimulacroEvent.SelectOption(question.id, it)) },
                    onToggleBookmark = { viewModel.onEvent(SimulacroEvent.ToggleBookmark(question.id)) }
                )
            }
        }
    }

    // Modal BottomSheet: Hoja de Respuestas (Cuadernillo ICFES)
    if (showAnswerSheetModal) {
        ModalBottomSheet(
            onDismissRequest = { showAnswerSheetModal = false },
            sheetState = rememberModalBottomSheetState()
        ) {
            HojaDeRespuestasBottomSheetContent(
                questions = uiState.questions,
                answers = uiState.answers,
                currentIndex = uiState.currentIndex,
                onSelectQuestion = { index ->
                    viewModel.onEvent(SimulacroEvent.JumpToQuestion(index))
                    showAnswerSheetModal = false
                }
            )
        }
    }

    // Diálogo de Confirmación de Entrega
    if (showFinishDialog) {
        val unanswered = uiState.totalQuestions - uiState.answeredCount
        AlertDialog(
            onDismissRequest = { showFinishDialog = false },
            icon = { Icon(Icons.Default.CheckCircle, contentDescription = null, tint = AzulInstitucional) },
            title = { Text(text = "¿Finalizar y calificar simulacro?", fontWeight = FontWeight.Bold) },
            text = {
                Text(
                    text = if (unanswered > 0)
                        "Tienes \$unanswered preguntas sin responder. En el ICFES no se descuentan puntos por respuestas erradas. ¿Deseas entregar ahora?"
                    else
                        "Has respondido todas las preguntas. Tu puntaje será calculado según la escala oficial de 0 a 500 puntos."
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        showFinishDialog = false
                        viewModel.onEvent(SimulacroEvent.ConfirmFinish)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = VerdeProgreso)
                ) {
                    Text(text = "Entregar y Calificar", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showFinishDialog = false }) {
                    Text(text = "Continuar respondiendo")
                }
            }
        )
    }

    // Diálogo para salir
    if (showExitDialog) {
        AlertDialog(
            onDismissRequest = { showExitDialog = false },
            icon = { Icon(Icons.Default.Warning, contentDescription = null, tint = RojoError) },
            title = { Text(text = "¿Abandonar simulacro?") },
            text = { Text(text = "El progreso del simulacro actual se perderá si sales antes de entregar.") },
            confirmButton = {
                Button(
                    onClick = {
                        showExitDialog = false
                        onNavigateHome()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RojoError)
                ) {
                    Text(text = "Salir al Inicio")
                }
            },
            dismissButton = {
                TextButton(onClick = { showExitDialog = false }) {
                    Text(text = "Quedarme")
                }
            }
        )
    }
}

@Composable
fun HojaDeRespuestasBottomSheetContent(
    questions: List<Question>,
    answers: Map<String, UserAnswerState>,
    currentIndex: Int,
    onSelectQuestion: (Int) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Hoja de Respuestas",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = AzulInstitucional
            )
            Text(
                text = "Toca un número para ir a la pregunta",
                fontSize = 12.sp,
                color = Color.Gray
            )
        }

        // Grilla interactiva de preguntas estilo hoja de respuestas ICFES
        LazyVerticalGrid(
            columns = GridCells.Fixed(5),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxWidth().heightIn(max = 340.dp)
        ) {
            itemsIndexed(questions) { index, question ->
                val answer = answers[question.id]
                val isAnswered = answer?.selectedOption != null
                val isMarked = answer?.isMarkedForReview == true
                val isCurrent = index == currentIndex

                val bubbleBg = when {
                    isMarked -> Color(0xFFFEF3C7) // Amber
                    isAnswered -> VerdeContenedor
                    else -> Color(0xFFF1F5F9)
                }
                val bubbleBorder = when {
                    isCurrent -> BorderStroke(2.dp, AzulInstitucional)
                    isMarked -> BorderStroke(1.dp, Color(0xFFD97706))
                    isAnswered -> BorderStroke(1.dp, VerdeProgreso)
                    else -> BorderStroke(1.dp, Color(0xFFCBD5E1))
                }

                Surface(
                    onClick = { onSelectQuestion(index) },
                    shape = RoundedCornerShape(12.dp),
                    color = bubbleBg,
                    border = bubbleBorder,
                    modifier = Modifier.aspectRatio(1f)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "\${index + 1}",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = if (isAnswered) Color(0xFF002113) else Color(0xFF334155)
                            )
                            if (isAnswered) {
                                Text(
                                    text = "\${answer?.selectedOption}",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Black,
                                    color = VerdeProgreso
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PreguntaSimulacroView(
    question: Question,
    currentIndex: Int,
    totalQuestions: Int,
    selectedOption: OptionLetter?,
    isMarkedForReview: Boolean,
    onSelectOption: (OptionLetter) -> Unit,
    onToggleBookmark: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            // Encabezado de Pregunta con Área y Bookmark
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Pregunta \${currentIndex + 1} de \$totalQuestions",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = AzulInstitucional
                )

                IconButton(onClick = onToggleBookmark) {
                    Icon(
                        imageVector = if (isMarkedForReview) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
                        contentDescription = "Marcar para revisión",
                        tint = if (isMarkedForReview) Color(0xFFD97706) else Color.Gray
                    )
                }
            }
        }

        // Contexto o Texto Guía de la Pregunta
        question.contextText?.let { context ->
            item {
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = Color(0xFFF8FAFC),
                    border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "TEXTO GUÍA / SITUACIÓN PROBLEMA",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = AzulInstitucional,
                            letterSpacing = 0.5.sp
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = context,
                            fontSize = 13.sp,
                            lineHeight = 19.sp,
                            color = Color(0xFF334155),
                            fontFamily = FontFamily.Serif
                        )
                    }
                }
            }
        }

        // Enunciado
        item {
            Text(
                text = question.prompt,
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF0F172A),
                lineHeight = 22.sp
            )
        }

        // Las 4 Opciones de Respuesta
        items(question.options.size) { idx ->
            val opt = question.options[idx]
            val isSelected = selectedOption == opt.id

            Surface(
                onClick = { onSelectOption(opt.id) },
                shape = RoundedCornerShape(16.dp),
                color = if (isSelected) AzulContenedor else Color.White,
                border = BorderStroke(
                    width = if (isSelected) 2.dp else 1.dp,
                    color = if (isSelected) AzulInstitucional else Color(0xFFE2E8F0)
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Surface(
                        shape = CircleShape,
                        color = if (isSelected) AzulInstitucional else Color(0xFFF1F5F9),
                        modifier = Modifier.size(28.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = opt.id.name,
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                color = if (isSelected) Color.White else Color(0xFF475569)
                            )
                        }
                    }
                    Text(
                        text = opt.text,
                        fontSize = 14.sp,
                        color = Color(0xFF1E293B),
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }
}

@Composable
fun ResultadosSimulacroView(
    uiState: SimulacroUiState,
    onRestart: () -> Unit,
    onNavigateHome: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = AzulInstitucional),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "Resultados del Simulacro",
                        color = Color.White,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Puntaje Global Oficial ICFES",
                        color = AzulContenedor,
                        fontSize = 12.sp
                    )
                    Text(
                        text = "\${uiState.finalScore}/500",
                        color = Color.White,
                        fontSize = 42.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace
                    )
                    Surface(
                        color = VerdeContenedor,
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = "Percentil Nacional: \${uiState.percentile} (Top \${100 - uiState.percentile}%)",
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                            color = Color(0xFF002113),
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp
                        )
                    }
                }
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = onRestart,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = AzulInstitucional)
                ) {
                    Text(text = "Repetir", fontWeight = FontWeight.Bold)
                }
                OutlinedButton(
                    onClick = onNavigateHome,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Text(text = "Ir al Inicio", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
`;

  const kotlinComposeCode = `// ========================================================
// ETAPA 2: MÓDULO DE PREGUNTAS INTERACTIVAS (JETPACK COMPOSE + M3)
// Archivo: PreguntasInteractivasScreen.kt
// ========================================================
package com.icfesmaster.presentation.ui.preguntas

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.icfesmaster.domain.model.OptionLetter
import com.icfesmaster.domain.model.Question

// Colores institucionales ICFES Material 3
private val AzulInstitucional = Color(0xFF0B2F64)
private val AzulContenedor = Color(0xFFDCE4F9)
private val VerdeProgreso = Color(0xFF00875A)
private val VerdeContenedor = Color(0xFFAFF2D4)
private val RojoError = Color(0xFFBA1A1A)
private val RojoContenedor = Color(0xFFFFDAD6)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PreguntasInteractivasScreen(
    viewModel: PreguntasViewModel,
    onNavigateBack: () -> Unit = {}
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "ICFES MASTER",
                            fontWeight = FontWeight.Bold,
                            color = AzulInstitucional
                        )
                        Text(
                            text = "Módulo Interactivo · Saber 11",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                ),
                actions = {
                    // Contador en vivo de aciertos
                    Surface(
                        color = VerdeContenedor,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.padding(end = 12.dp)
                    ) {
                        Text(
                            text = "Aciertos: \${uiState.score} / \${uiState.totalQuestions}",
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp,
                            color = Color(0xFF002113)
                        )
                    }
                }
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(MaterialTheme.colorScheme.background)
        ) {
            if (uiState.isCompleted) {
                // 4. Pantalla de Resumen Final de Aciertos
                ResumenAciertosView(
                    score = uiState.score,
                    totalQuestions = uiState.totalQuestions,
                    onRestart = { viewModel.onEvent(PreguntasEvent.RestartQuiz) }
                )
            } else {
                uiState.currentQuestion?.let { question ->
                    CuestionarioInteractivoView(
                        question = question,
                        currentIndex = uiState.currentIndex,
                        totalQuestions = uiState.totalQuestions,
                        selectedOption = uiState.selectedOption,
                        isAnswerSubmitted = uiState.isAnswerSubmitted,
                        onSelectOption = { viewModel.onEvent(PreguntasEvent.SelectOption(it)) },
                        onNextQuestion = { viewModel.onEvent(PreguntasEvent.NextQuestion) }
                    )
                }
            }
        }
    }
}

@Composable
fun CuestionarioInteractivoView(
    question: Question,
    currentIndex: Int,
    totalQuestions: Int,
    selectedOption: OptionLetter?,
    isAnswerSubmitted: Boolean,
    onSelectOption: (OptionLetter) -> Unit,
    onNextQuestion: () -> Unit
) {
    val progress = (currentIndex + 1).toFloat() / totalQuestions.toFloat()
    val isCorrect = selectedOption == question.correctAnswer

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Indicador de Progreso Material 3
        item {
            Column(modifier = Modifier.fillMaxWidth().padding(top = 8.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Pregunta \${currentIndex + 1} de \$totalQuestions",
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp,
                        color = AzulInstitucional
                    )
                    Text(
                        text = "\${(progress * 100).toInt()}% completado",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = VerdeProgreso
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                LinearProgressIndicator(
                    progress = { progress },
                    modifier = Modifier.fillMaxWidth().height(6.dp).clip(RoundedCornerShape(3.dp)),
                    color = VerdeProgreso,
                    trackColor = VerdeContenedor
                )
            }
        }

        // Tarjeta Principal de la Pregunta
        item {
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                    // Metadatos
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            color = AzulContenedor,
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text(
                                text = question.area.title,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                fontWeight = FontWeight.Bold,
                                fontSize = 11.sp,
                                color = AzulInstitucional
                            )
                        }
                        Text(
                            text = question.topic,
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    // 1. Contexto o Texto Guía de la Pregunta
                    question.contextText?.let { context ->
                        Surface(
                            color = Color(0xFFF7F9FC),
                            shape = RoundedCornerShape(16.dp),
                            border = BorderStroke(1.dp, Color(0xFFE1E7F0)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Text(
                                    text = "CONTEXTO O LECTURA GUÍA",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 10.sp,
                                    color = AzulInstitucional,
                                    letterSpacing = 1.sp
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = context,
                                    fontSize = 13.sp,
                                    lineHeight = 20.sp,
                                    fontFamily = FontFamily.Serif,
                                    color = Color(0xFF191C1E)
                                )
                            }
                        }
                    }

                    // Enunciado
                    Text(
                        text = question.prompt,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = AzulInstitucional,
                        lineHeight = 22.sp
                    )

                    // 2. Las 4 Opciones de Respuesta (A, B, C, D)
                    question.options.forEach { option ->
                        val isSelected = selectedOption == option.id
                        val isOptionCorrect = option.id == question.correctAnswer

                        val (cardColor, borderColor, badgeColor, badgeTextColor) = when {
                            !isAnswerSubmitted && isSelected -> 
                                Quadruple(AzulContenedor, AzulInstitucional, AzulInstitucional, Color.White)
                            isAnswerSubmitted && isOptionCorrect -> 
                                Quadruple(VerdeContenedor.copy(alpha = 0.4f), VerdeProgreso, VerdeProgreso, Color.White)
                            isAnswerSubmitted && isSelected && !isOptionCorrect -> 
                                Quadruple(RojoContenedor.copy(alpha = 0.5f), RojoError, RojoError, Color.White)
                            else -> 
                                Quadruple(Color.White, Color(0xFFC3C7D0), Color(0xFFE1E7F0), Color(0xFF43474E))
                        }

                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = cardColor,
                            border = BorderStroke(1.dp, borderColor),
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable(enabled = !isAnswerSubmitted) { onSelectOption(option.id) }
                        ) {
                            Row(
                                modifier = Modifier.padding(14.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(28.dp)
                                        .background(badgeColor, CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = option.id.name,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp,
                                        color = badgeTextColor
                                    )
                                }
                                Text(
                                    text = option.text,
                                    fontSize = 14.sp,
                                    color = Color(0xFF191C1E),
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                    }

                    // 3. Feedback Inmediato con Justificación Pedagógica
                    AnimatedVisibility(visible = isAnswerSubmitted) {
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = if (isCorrect) VerdeContenedor.copy(alpha = 0.35f) else RojoContenedor.copy(alpha = 0.35f),
                            border = BorderStroke(1.dp, if (isCorrect) VerdeProgreso else RojoError),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(
                                modifier = Modifier.padding(16.dp),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Icon(
                                        imageVector = if (isCorrect) Icons.Default.CheckCircle else Icons.Default.Close,
                                        contentDescription = null,
                                        tint = if (isCorrect) VerdeProgreso else RojoError
                                    )
                                    Text(
                                        text = if (isCorrect) "¡Respuesta Correcta!" else "Respuesta Incorrecta",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 14.sp,
                                        color = if (isCorrect) VerdeProgreso else RojoError
                                    )
                                }

                                Surface(
                                    shape = RoundedCornerShape(12.dp),
                                    color = Color.White,
                                    border = BorderStroke(1.dp, Color(0xFFE1E7F0))
                                ) {
                                    Column(modifier = Modifier.padding(12.dp)) {
                                        Text(
                                            text = "Justificación Pedagógica:",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 12.sp,
                                            color = AzulInstitucional
                                        )
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(
                                            text = question.explanation,
                                            fontSize = 12.sp,
                                            lineHeight = 18.sp,
                                            color = Color(0xFF43474E)
                                        )
                                    }
                                }

                                // 4. Botón para pasar a la siguiente pregunta
                                Button(
                                    onClick = onNextQuestion,
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (isCorrect) VerdeProgreso else AzulInstitucional
                                    ),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier.align(Alignment.End)
                                ) {
                                    Text(
                                        text = if (currentIndex < totalQuestions - 1) "Siguiente Pregunta" else "Ver Resumen de Aciertos",
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ResumenAciertosView(
    score: Int,
    totalQuestions: Int,
    onRestart: () -> Unit
) {
    val percentage = ((score.toFloat() / totalQuestions.toFloat()) * 100).toInt()

    Card(
        shape = RoundedCornerShape(28.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Surface(
                color = AzulContenedor,
                shape = CircleShape,
                modifier = Modifier.size(64.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(text = "\$score/\$totalQuestions", fontWeight = FontWeight.Black, fontSize = 18.sp, color = AzulInstitucional)
                }
            }

            Text(
                text = "¡Cuestionario Completado!",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = AzulInstitucional
            )

            Text(
                text = "Obtuviste un \$percentage% de aciertos en este bloque de preparación Saber 11.",
                fontSize = 14.sp,
                color = Color(0xFF43474E),
                lineHeight = 20.sp
            )

            Button(
                onClick = onRestart,
                colors = ButtonDefaults.buttonColors(containerColor = VerdeProgreso),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(Icons.Default.Refresh, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text(text = "Repetir Cuestionario", fontWeight = FontWeight.Bold)
            }
        }
    }
}

private data class Quadruple<A, B, C, D>(val first: A, val second: B, val third: C, val fourth: D)`;

  const kotlinViewModelCode = `// ========================================================
// ETAPA 2: STATE HOLDER & VIEWMODEL (STATEFLOW + UDF)
// Archivo: PreguntasViewModel.kt
// ========================================================
package com.icfesmaster.presentation.ui.preguntas

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.icfesmaster.domain.model.AreaType
import com.icfesmaster.domain.model.OptionLetter
import com.icfesmaster.domain.model.Question
import com.icfesmaster.domain.repository.ExamRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

// Estado inmutable de la pantalla (UI State)
data class PreguntasUiState(
    val selectedSubject: AreaType = AreaType.MATEMATICAS,
    val questions: List<Question> = emptyList(),
    val currentIndex: Int = 0,
    val selectedOption: OptionLetter? = null,
    val isAnswerSubmitted: Boolean = false,
    val score: Int = 0,
    val isCompleted: Boolean = false,
    val isLoading: Boolean = true
) {
    val currentQuestion: Question?
        get() = questions.getOrNull(currentIndex)

    val totalQuestions: Int
        get() = questions.size
}

// Eventos que la UI envía al ViewModel (UDF)
sealed interface PreguntasEvent {
    data class SelectOption(val option: OptionLetter) : PreguntasEvent
    object NextQuestion : PreguntasEvent
    data class ChangeSubject(val subject: AreaType) : PreguntasEvent
    object RestartQuiz : PreguntasEvent
}

class PreguntasViewModel(
    private val examRepository: ExamRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(PreguntasUiState())
    val uiState: StateFlow<PreguntasUiState> = _uiState.asStateFlow()

    init {
        loadQuestionsForSubject(_uiState.value.selectedSubject)
    }

    fun onEvent(event: PreguntasEvent) {
        when (event) {
            is PreguntasEvent.SelectOption -> handleSelectOption(event.option)
            is PreguntasEvent.NextQuestion -> handleNextQuestion()
            is PreguntasEvent.ChangeSubject -> {
                _uiState.update { it.copy(selectedSubject = event.subject) }
                loadQuestionsForSubject(event.subject)
            }
            is PreguntasEvent.RestartQuiz -> {
                loadQuestionsForSubject(_uiState.value.selectedSubject)
            }
        }
    }

    private fun handleSelectOption(option: OptionLetter) {
        val state = _uiState.value
        if (state.isAnswerSubmitted) return

        val question = state.currentQuestion ?: return
        val isCorrect = option == question.correctAnswer

        _uiState.update { current ->
            current.copy(
                selectedOption = option,
                isAnswerSubmitted = true,
                score = if (isCorrect) current.score + 1 else current.score
            )
        }
    }

    private fun handleNextQuestion() {
        val state = _uiState.value
        if (state.currentIndex < state.totalQuestions - 1) {
            _uiState.update { current ->
                current.copy(
                    currentIndex = current.currentIndex + 1,
                    selectedOption = null,
                    isAnswerSubmitted = false
                )
            }
        } else {
            _uiState.update { it.copy(isCompleted = true) }
        }
    }

    private fun loadQuestionsForSubject(subject: AreaType) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            val loadedQuestions = examRepository.getQuestionsByArea(subject)
            _uiState.update {
                it.copy(
                    questions = loadedQuestions,
                    currentIndex = 0,
                    selectedOption = null,
                    isAnswerSubmitted = false,
                    score = 0,
                    isCompleted = false,
                    isLoading = false
                )
            }
        }
    }
}`;

  const kotlinDomainCode = `// Domain: Modelos puros y Casos de Uso (Clean Architecture)
package com.icfesmaster.domain.model

enum class AreaType(val title: String, val officialWeight: Int) {
    MATEMATICAS("Matemáticas", 3),
    LECTURA_CRITICA("Lectura Crítica", 3),
    CIENCIAS_NATURALES("Ciencias Naturales", 3),
    SOCIALES_CIUDADANAS("Sociales y Ciudadanas", 3),
    INGLES("Inglés", 1)
}

enum class OptionLetter { A, B, C, D }

data class Question(
    val id: String,
    val area: AreaType,
    val topic: String,
    val contextText: String?,
    val prompt: String,
    val options: List<QuestionOption>,
    val correctAnswer: OptionLetter,
    val explanation: String
)

data class QuestionOption(
    val id: OptionLetter,
    val text: String
)

interface ExamRepository {
    suspend fun getQuestionsByArea(area: AreaType): List<Question>
    suspend fun getAllQuestions(): List<Question>
    suspend fun calculateScore(answers: Map<String, OptionLetter>): IcfesScoreResult
}`;

  return (
    <div className="space-y-6 pb-24">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0B2F64] via-[#0E3D7E] to-[#00668B] text-white p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#AFF2D4] w-fit mb-3">
          <Cpu className="w-4 h-4" />
          <span>Arquitectura Android Nativa & Material 3</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Arquitectura Limpia (Clean Architecture)
        </h2>
        <p className="text-sm text-blue-100 max-w-2xl mt-2 leading-relaxed">
          Diseño desacoplado, escalable y mantenible para ICFES MASTER siguiendo las directrices oficiales de Android Architecture Components, UDF (Unidirectional Data Flow) y Material Design 3.
        </p>
      </div>

      {/* Architecture Layers Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <M3Card variant="outlined" className="p-5 space-y-3 border-[#0B2F64]/30">
          <div className="w-9 h-9 rounded-xl bg-[#DCE4F9] text-[#0B2F64] flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="text-base font-bold text-[#0B2F64]">Capa de Dominio (Domain)</h3>
          <p className="text-xs text-[#43474E] leading-relaxed">
            Entidades puras (Question, ExamSession), Casos de Uso (Use Cases) y contratos abstractos de repositorio. Cero dependencias de framework.
          </p>
          <div className="text-[11px] font-mono text-[#00668B] bg-[#F0F4FC] p-2 rounded-lg">
            :core:domain
          </div>
        </M3Card>

        <M3Card variant="outlined" className="p-5 space-y-3 border-[#00668B]/30">
          <div className="w-9 h-9 rounded-xl bg-[#C4E7FF] text-[#00668B] flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="text-base font-bold text-[#00668B]">Capa de Datos (Data)</h3>
          <p className="text-xs text-[#43474E] leading-relaxed">
            Implementación de repositorios, Room Database para almacenamiento local offline, persistencia de cuadernillo y DataStore para preferencias.
          </p>
          <div className="text-[11px] font-mono text-[#00668B] bg-[#F0F4FC] p-2 rounded-lg">
            :core:data
          </div>
        </M3Card>

        <M3Card variant="outlined" className="p-5 space-y-3 border-[#00875A]/30">
          <div className="w-9 h-9 rounded-xl bg-[#AFF2D4] text-[#00875A] flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="text-base font-bold text-[#00875A]">Capa de Presentación</h3>
          <p className="text-xs text-[#43474E] leading-relaxed">
            Jetpack Compose declarativo, Material 3 Expressive tokens, ViewModels con StateFlow inmutable y manejo reactivo de eventos de usuario (MVI).
          </p>
          <div className="text-[11px] font-mono text-[#00875A] bg-[#F0F4FC] p-2 rounded-lg">
            :feature:simulacro
          </div>
        </M3Card>
      </div>

      {/* Code Viewer & Specs */}
      <M3Card variant="elevated" className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E1E7F0]">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#0B2F64]" />
            <h3 className="text-base font-bold text-[#0B2F64]">
              Implementación Técnica en Kotlin & Jetpack Compose
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <M3Chip
              label="SimulacroScreen.kt"
              selected={activeTab === 'simulacro_compose'}
              onClick={() => setActiveTab('simulacro_compose')}
            />
            <M3Chip
              label="PreguntasInteractivasScreen.kt"
              selected={activeTab === 'preguntas_compose'}
              onClick={() => setActiveTab('preguntas_compose')}
            />
            <M3Chip
              label="ViewModel & StateFlow"
              selected={activeTab === 'viewmodel'}
              onClick={() => setActiveTab('viewmodel')}
            />
            <M3Chip
              label="Domain & Repository"
              selected={activeTab === 'domain'}
              onClick={() => setActiveTab('domain')}
            />
          </div>
        </div>

        {/* Code Block Container */}
        <div className="relative rounded-2xl bg-[#0F172A] text-slate-200 p-4 font-mono text-xs overflow-x-auto">
          <button
            onClick={() => {
              const code =
                activeTab === 'simulacro_compose'
                  ? kotlinSimulacroScreenCode
                  : activeTab === 'preguntas_compose'
                  ? kotlinComposeCode
                  : activeTab === 'viewmodel'
                  ? kotlinViewModelCode
                  : kotlinDomainCode;
              copyToClipboard(code, activeTab);
            }}
            className="absolute right-3 top-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedCode === activeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Kotlin</span>
              </>
            )}
          </button>

          <pre className="leading-relaxed pt-6">
            {activeTab === 'simulacro_compose' && kotlinSimulacroScreenCode}
            {activeTab === 'preguntas_compose' && kotlinComposeCode}
            {activeTab === 'viewmodel' && kotlinViewModelCode}
            {activeTab === 'domain' && kotlinDomainCode}
          </pre>
        </div>
      </M3Card>
    </div>
  );
};

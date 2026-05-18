package com.seasonwheel.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.runtime.collectAsState
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch
import android.content.Context

private val Context.dataStore by preferencesDataStore(name = "season_prefs")
private val SEASON_KEY = intPreferencesKey("current_season")

enum class Season(
    val label: String,
    val emoji: String,
    val primary: Color,
    val secondary: Color,
    val background: Brush,
) {
    SPRING(
        label = "Printemps",
        emoji = "🌸",
        primary = Color(0xFF66BB6A),
        secondary = Color(0xFFC8E6C9),
        background = Brush.verticalGradient(listOf(Color(0xFFE8F5E9), Color(0xFFC8E6C9)))
    ),
    SUMMER(
        label = "Été",
        emoji = "☀️",
        primary = Color(0xFFFFB300),
        secondary = Color(0xFFFFE082),
        background = Brush.verticalGradient(listOf(Color(0xFFFFF8E1), Color(0xFFFFE082)))
    ),
    AUTUMN(
        label = "Automne",
        emoji = "🍂",
        primary = Color(0xFFE65100),
        secondary = Color(0xFFFFCC80),
        background = Brush.verticalGradient(listOf(Color(0xFFFFF3E0), Color(0xFFFFCC80)))
    ),
    WINTER(
        label = "Hiver",
        emoji = "❄️",
        primary = Color(0xFF42A5F5),
        secondary = Color(0xFFB3E5FC),
        background = Brush.verticalGradient(listOf(Color(0xFFE1F5FE), Color(0xFFB3E5FC)))
    );

    fun next(): Season = entries[(ordinal + 1) % entries.size]
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MaterialTheme {
                SeasonWheelApp()
            }
        }
    }
}

@Composable
fun SeasonWheelApp() {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    val storedIndex by context.dataStore.data
        .map { it[SEASON_KEY] ?: 0 }
        .collectAsState(initial = 0)

    val season = Season.entries[storedIndex.coerceIn(0, Season.entries.size - 1)]
    var pickerMode by remember { mutableStateOf(false) }

    fun setSeason(s: Season) {
        scope.launch {
            context.dataStore.edit { it[SEASON_KEY] = s.ordinal }
        }
    }

    Surface(modifier = Modifier.fillMaxSize()) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(season.background)
                .padding(24.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "Roue des Saisons",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = season.primary,
                )
                Spacer(Modifier.height(8.dp))
                Text(
                    text = if (pickerMode) "Choisis une saison" else "Touche la roue",
                    fontSize = 16.sp,
                    color = season.primary.copy(alpha = 0.7f),
                )
                Spacer(Modifier.height(32.dp))

                SeasonWheel(
                    currentSeason = season,
                    pickerMode = pickerMode,
                    onTapWheel = { setSeason(season.next()) },
                    onSelectSeason = { setSeason(it) },
                )

                Spacer(Modifier.height(32.dp))

                AnimatedContent(
                    targetState = season,
                    transitionSpec = {
                        (fadeIn(tween(400)) togetherWith fadeOut(tween(200)))
                    },
                    label = "season-label"
                ) { s ->
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = s.emoji,
                            fontSize = 48.sp,
                        )
                        Text(
                            text = s.label,
                            fontSize = 36.sp,
                            fontWeight = FontWeight.Bold,
                            color = s.primary,
                        )
                    }
                }

                Spacer(Modifier.height(32.dp))

                ModeToggle(
                    pickerMode = pickerMode,
                    accent = season.primary,
                    onToggle = { pickerMode = !pickerMode }
                )
            }
        }
    }
}

@Composable
fun ModeToggle(pickerMode: Boolean, accent: Color, onToggle: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth(0.8f)
            .clickable { onToggle() }
            .shadow(4.dp, RoundedCornerShape(28.dp)),
        shape = RoundedCornerShape(28.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.85f)),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
        ) {
            Text(
                text = if (pickerMode) "Mode sélection" else "Mode cycle",
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                color = accent,
            )
            Spacer(Modifier.size(8.dp))
            Text(
                text = if (pickerMode) "✓" else "↻",
                fontSize = 18.sp,
                color = accent,
            )
        }
    }
}

@Composable
fun SeasonWheel(
    currentSeason: Season,
    pickerMode: Boolean,
    onTapWheel: () -> Unit,
    onSelectSeason: (Season) -> Unit,
) {
    val rotation = remember { Animatable(0f) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(currentSeason) {
        val target = -currentSeason.ordinal * 90f
        val current = rotation.value
        val delta = ((target - current + 540f) % 360f) - 180f
        rotation.animateTo(
            targetValue = current + delta,
            animationSpec = tween(durationMillis = 650, easing = LinearOutSlowInEasing)
        )
    }

    Box(
        modifier = Modifier
            .fillMaxWidth(0.85f)
            .aspectRatio(1f),
        contentAlignment = Alignment.Center
    ) {
        Canvas(
            modifier = Modifier
                .fillMaxSize()
                .shadow(12.dp, CircleShape)
                .clip(CircleShape)
                .background(Color.White)
                .rotate(rotation.value)
                .pointerInput(pickerMode, currentSeason) {
                    detectTapGestures { offset ->
                        if (!pickerMode) {
                            onTapWheel()
                        } else {
                            val cx = size.width / 2f
                            val cy = size.height / 2f
                            val dx = offset.x - cx
                            val dy = offset.y - cy
                            val rawAngle = Math.toDegrees(kotlin.math.atan2(dy, dx).toDouble())
                            val unrotated = (rawAngle - rotation.value + 720) % 360
                            val shifted = (unrotated + 45 + 90) % 360
                            val index = (shifted / 90).toInt().coerceIn(0, 3)
                            onSelectSeason(Season.entries[index])
                        }
                    }
                }
        ) {
            val diameter = size.minDimension
            val topLeft = Offset(
                (size.width - diameter) / 2f,
                (size.height - diameter) / 2f
            )
            val arcSize = Size(diameter, diameter)

            Season.entries.forEachIndexed { i, s ->
                drawArc(
                    color = s.secondary,
                    startAngle = -135f + i * 90f,
                    sweepAngle = 90f,
                    useCenter = true,
                    topLeft = topLeft,
                    size = arcSize,
                )
                drawArc(
                    color = s.primary,
                    startAngle = -135f + i * 90f,
                    sweepAngle = 90f,
                    useCenter = true,
                    topLeft = topLeft,
                    size = arcSize,
                    style = Stroke(width = 4f)
                )
            }

            drawCircle(
                color = Color.White,
                radius = diameter * 0.18f,
                center = Offset(size.width / 2f, size.height / 2f)
            )
            drawCircle(
                color = currentSeason.primary,
                radius = diameter * 0.18f,
                center = Offset(size.width / 2f, size.height / 2f),
                style = Stroke(width = 6f)
            )
        }

        WheelLabels(rotation = rotation.value)

        Box(
            modifier = Modifier
                .size(54.dp)
                .clip(CircleShape)
                .background(currentSeason.primary),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = currentSeason.emoji,
                fontSize = 24.sp,
            )
        }

        Box(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .padding(top = 4.dp)
                .size(width = 18.dp, height = 28.dp)
                .clip(RoundedCornerShape(bottomStart = 16.dp, bottomEnd = 16.dp, topStart = 4.dp, topEnd = 4.dp))
                .background(Color(0xFF263238))
        )
    }
}

@Composable
fun WheelLabels(rotation: Float) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .rotate(rotation),
        contentAlignment = Alignment.Center
    ) {
        Season.entries.forEachIndexed { i, s ->
            QuadrantLabel(season = s, quadrantIndex = i)
        }
    }
}

@Composable
fun QuadrantLabel(season: Season, quadrantIndex: Int) {
    val angle = -90f + quadrantIndex * 90f
    Box(
        modifier = Modifier
            .fillMaxSize()
            .rotate(angle),
        contentAlignment = Alignment.TopCenter
    ) {
        Column(
            modifier = Modifier.padding(top = 36.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = season.emoji,
                fontSize = 36.sp,
            )
            Text(
                text = season.label,
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = season.primary,
                textAlign = TextAlign.Center,
            )
        }
    }
}

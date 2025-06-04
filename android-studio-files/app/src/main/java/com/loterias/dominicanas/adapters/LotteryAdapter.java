
package com.loterias.dominicanas.adapters;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.card.MaterialCardView;
import com.loterias.dominicanas.R;
import com.loterias.dominicanas.models.Lottery;

import java.util.List;

public class LotteryAdapter extends RecyclerView.Adapter<LotteryAdapter.LotteryViewHolder> {

    private Context context;
    private List<Lottery> lotteries;
    private OnLotteryClickListener listener;

    public interface OnLotteryClickListener {
        void onLotteryClick(Lottery lottery);
        void onShareClick(Lottery lottery);
        void onHistoryClick(Lottery lottery);
        void onStatisticsClick(Lottery lottery);
        void onFavoriteClick(Lottery lottery);
    }

    public LotteryAdapter(Context context, List<Lottery> lotteries) {
        this.context = context;
        this.lotteries = lotteries;
    }

    public void setOnLotteryClickListener(OnLotteryClickListener listener) {
        this.listener = listener;
    }

    @NonNull
    @Override
    public LotteryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_lottery_card, parent, false);
        return new LotteryViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull LotteryViewHolder holder, int position) {
        Lottery lottery = lotteries.get(position);
        holder.bind(lottery);
    }

    @Override
    public int getItemCount() {
        return lotteries.size();
    }

    public void updateLotteries(List<Lottery> newLotteries) {
        this.lotteries = newLotteries;
        notifyDataSetChanged();
    }

    class LotteryViewHolder extends RecyclerView.ViewHolder {
        MaterialCardView cardView;
        ImageView logoImage;
        TextView titleText;
        TextView countryText;
        TextView timeText;
        TextView dateText;
        TextView websiteText;
        LinearLayout numbersContainer;
        TextView positionLabels;
        MaterialButton previousButton;
        MaterialButton shareButton;
        MaterialButton statisticsButton;
        MaterialButton downloadButton;
        MaterialButton printButton;

        public LotteryViewHolder(@NonNull View itemView) {
            super(itemView);
            cardView = itemView.findViewById(R.id.cardView);
            logoImage = itemView.findViewById(R.id.logoImage);
            titleText = itemView.findViewById(R.id.titleText);
            countryText = itemView.findViewById(R.id.countryText);
            timeText = itemView.findViewById(R.id.timeText);
            dateText = itemView.findViewById(R.id.dateText);
            websiteText = itemView.findViewById(R.id.websiteText);
            numbersContainer = itemView.findViewById(R.id.numbersContainer);
            positionLabels = itemView.findViewById(R.id.positionLabels);
            previousButton = itemView.findViewById(R.id.previousButton);
            shareButton = itemView.findViewById(R.id.shareButton);
            statisticsButton = itemView.findViewById(R.id.statisticsButton);
            downloadButton = itemView.findViewById(R.id.downloadButton);
            printButton = itemView.findViewById(R.id.printButton);
        }

        public void bind(Lottery lottery) {
            titleText.setText(lottery.getTitulo());
            countryText.setText(lottery.getPais());
            timeText.setText(lottery.getFormattedTime());
            websiteText.setText("vilug.com");
            
            // Load logo image
            Glide.with(context)
                    .load(lottery.getImage())
                    .placeholder(R.drawable.ic_lottery_placeholder)
                    .error(R.drawable.ic_lottery_placeholder)
                    .into(logoImage);

            // Clear previous numbers
            numbersContainer.removeAllViews();

            // Add lottery numbers
            if (lottery.getUltimoSorteo() != null && lottery.getUltimoSorteo().getPremios() != null) {
                String[] numbers = lottery.getUltimoSorteo().getPremiosArray();
                LayoutInflater inflater = LayoutInflater.from(context);
                
                for (String number : numbers) {
                    View numberView = inflater.inflate(R.layout.item_lottery_number, numbersContainer, false);
                    TextView numberText = numberView.findViewById(R.id.numberText);
                    numberText.setText(number);
                    numbersContainer.addView(numberView);
                }
                dateText.setText(lottery.getUltimoSorteo().getFormattedDate());
                positionLabels.setVisibility(View.VISIBLE);
            } else {
                TextView noResults = new TextView(context);
                noResults.setText("Sin resultados disponibles");
                noResults.setTextColor(context.getResources().getColor(R.color.text_secondary, null));
                noResults.setGravity(android.view.Gravity.CENTER);
                numbersContainer.addView(noResults);
                dateText.setText("--/--/----");
                positionLabels.setVisibility(View.GONE);
            }

            // Set click listeners
            cardView.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onLotteryClick(lottery);
                }
            });

            previousButton.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onHistoryClick(lottery);
                }
            });

            shareButton.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onShareClick(lottery);
                }
            });

            statisticsButton.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onStatisticsClick(lottery);
                }
            });

            downloadButton.setOnClickListener(v -> {
                // Handle download
            });

            printButton.setOnClickListener(v -> {
                // Handle print
            });
        }
    }
}
